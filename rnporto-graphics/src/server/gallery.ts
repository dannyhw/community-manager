import { createServerFn } from '@tanstack/react-start'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// Saved gallery entries live in `data/gallery/<id>/` at the package root,
// one directory per save. Each entry holds the editable config (template
// id, field values, theme) plus a rasterised thumbnail used to populate
// the gallery page. The full-resolution PNG is intentionally _not_ stored
// — the studio re-renders at full quality when the user reloads an entry,
// so we keep disk usage proportional to gallery-card size rather than
// export size.

const GALLERY_DIR = path.resolve(process.cwd(), 'data/gallery')

export interface GalleryEntry {
  id: string
  templateId: string
  name: string
  values: Record<string, string>
  mode: 'light' | 'dark'
  accent: string
  width: number
  height: number
  createdAt: string
  updatedAt: string
}

// What the gallery cards need to render. The thumbnail isn't inlined —
// the listing carries a URL that resolves to /api/gallery/:id/thumb,
// where a separate server route streams the on-disk PNG with proper
// Content-Type and HTTP caching. Inlining as base64 (the previous
// approach) bloated the listing payload by ~33% per entry and forced a
// full re-fetch on every gallery page view.
export interface GalleryEntryWithThumb extends GalleryEntry {
  thumbUrl: string
}

export interface SaveInput {
  /** Optional — supplying an id overwrites that entry (used by "save changes"). */
  id?: string
  templateId: string
  name: string
  values: Record<string, string>
  mode: 'light' | 'dark'
  accent: string
  width: number
  height: number
  /** `data:image/png;base64,...` from `html-to-image` on the client. */
  thumbDataUrl: string
}

async function ensureGalleryDir() {
  await fs.mkdir(GALLERY_DIR, { recursive: true })
}

function entryDir(id: string) {
  // Reject anything that isn't a plain id so a malicious id can't escape
  // the gallery dir via `..` or absolute paths.
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    throw new Error(`Invalid gallery id: ${id}`)
  }
  return path.join(GALLERY_DIR, id)
}

function dataUrlToBuffer(dataUrl: string) {
  const comma = dataUrl.indexOf(',')
  if (comma === -1) throw new Error('Invalid data URL')
  return Buffer.from(dataUrl.slice(comma + 1), 'base64')
}

function newId() {
  // Time-prefixed so directory listings sort newest-last naturally; the
  // random tail keeps collisions impossible for practical purposes.
  const t = Date.now().toString(36)
  const r = Math.random().toString(36).slice(2, 8)
  return `${t}-${r}`
}

// MIME → filesystem extension for asset uploads. We only handle image
// types the editor's `<input type="file" accept="image/*">` would
// realistically produce; anything else falls back to `.bin` and is
// served back with its original Content-Type from the route's lookup.
const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}
function mimeToExt(mime: string): string {
  return MIME_EXT[mime.toLowerCase()] ?? 'bin'
}

// Detect a base64 data URL produced by `FileReader.readAsDataURL`. Used
// to peel binary uploads out of the `values` object so config.json
// doesn't get polluted with 200 KB of base64 per uploaded photo.
const DATA_URL_RE = /^data:([^;,]+);base64,(.+)$/

// Extract any data-URL valued fields, write them to disk under
// `<entryDir>/assets/<key>.<ext>`, and return a copy of `values` with
// those fields rewritten to URLs that resolve to the asset-serving
// route. Pure data fields (text/select) pass through untouched.
async function persistAssets(
  id: string,
  dir: string,
  values: Record<string, string>,
): Promise<Record<string, string>> {
  const assetsDir = path.join(dir, 'assets')
  const out: Record<string, string> = {}
  let assetsDirEnsured = false

  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== 'string' || !value.startsWith('data:')) {
      out[key] = value
      continue
    }
    const match = DATA_URL_RE.exec(value)
    if (!match) {
      // Malformed data URL — drop it so we don't persist a broken blob.
      out[key] = ''
      continue
    }
    const [, mime, b64] = match
    const ext = mimeToExt(mime)

    if (!assetsDirEnsured) {
      await fs.mkdir(assetsDir, { recursive: true })
      assetsDirEnsured = true
    }
    // Re-upload with a different MIME would otherwise leave the old
    // file behind under a different extension. Clear any prior file
    // for this key before writing the new one.
    try {
      for (const f of await fs.readdir(assetsDir)) {
        if (f === `${key}.${ext}` || f.startsWith(`${key}.`)) {
          await fs.rm(path.join(assetsDir, f), { force: true })
        }
      }
    } catch {
      // assets/ doesn't exist yet — nothing to clean.
    }
    await fs.writeFile(path.join(assetsDir, `${key}.${ext}`), Buffer.from(b64, 'base64'))
    out[key] = `/api/gallery/${encodeURIComponent(id)}/asset/${encodeURIComponent(key)}`
  }

  return out
}

export const saveGraphic = createServerFn({ method: 'POST' })
  .inputValidator((data: SaveInput) => data)
  .handler(async ({ data }): Promise<GalleryEntry> => {
    await ensureGalleryDir()

    const id = data.id ?? newId()
    const dir = entryDir(id)
    await fs.mkdir(dir, { recursive: true })

    const now = new Date().toISOString()
    let createdAt = now
    // If we're overwriting, preserve the original createdAt for sort stability.
    try {
      const existing = JSON.parse(
        await fs.readFile(path.join(dir, 'config.json'), 'utf8'),
      ) as GalleryEntry
      createdAt = existing.createdAt ?? now
    } catch {
      // No prior entry; new save.
    }

    // Peel base64 data URLs out of `values` into separate asset files so
    // config.json stays text-sized and the editor's `<img>` can stream
    // photos via /api/gallery/:id/asset/:key on next load.
    const persistedValues = await persistAssets(id, dir, data.values)

    const entry: GalleryEntry = {
      id,
      templateId: data.templateId,
      name: data.name.trim() || 'Untitled',
      values: persistedValues,
      mode: data.mode,
      accent: data.accent,
      width: data.width,
      height: data.height,
      createdAt,
      updatedAt: now,
    }

    await fs.writeFile(
      path.join(dir, 'config.json'),
      JSON.stringify(entry, null, 2),
      'utf8',
    )
    await fs.writeFile(path.join(dir, 'thumb.png'), dataUrlToBuffer(data.thumbDataUrl))

    return entry
  })

export const listGraphics = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<GalleryEntryWithThumb>> => {
    await ensureGalleryDir()
    const ids = (await fs.readdir(GALLERY_DIR, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name)

    const entries = await Promise.all(
      ids.map(async (id) => {
        try {
          const dir = entryDir(id)
          const config = JSON.parse(
            await fs.readFile(path.join(dir, 'config.json'), 'utf8'),
          ) as GalleryEntry
          // Confirm the thumbnail exists on disk before promising the
          // URL — if the entry is half-written we want to skip it
          // rather than handing back a 404-bound link.
          await fs.access(path.join(dir, 'thumb.png'))
          const thumbUrl = `/api/gallery/${encodeURIComponent(id)}/thumb`
          return { ...config, thumbUrl } satisfies GalleryEntryWithThumb
        } catch {
          // Skip half-written or corrupt entries rather than failing the
          // whole listing.
          return null
        }
      }),
    )

    return entries
      .filter((e): e is GalleryEntryWithThumb => e !== null)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },
)

export const getGraphic = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<GalleryEntry> => {
    const config = JSON.parse(
      await fs.readFile(path.join(entryDir(data.id), 'config.json'), 'utf8'),
    ) as GalleryEntry
    return config
  })

export const deleteGraphic = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<{ id: string }> => {
    await fs.rm(entryDir(data.id), { recursive: true, force: true })
    return { id: data.id }
  })
