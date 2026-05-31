import { createServerFn } from '@tanstack/react-start'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// Speaker library lives at `data/speakers/<id>/` mirroring the gallery
// structure: a `config.json` for the editable record and an optional
// `photo.<ext>` for the binary upload. Records hold the canonical
// speaker+talk data that the studio picker applies to a slot.

const SPEAKERS_DIR = path.resolve(process.cwd(), 'data/speakers')

export interface SpeakerRecord {
  id: string
  name: string
  title: string
  company: string
  talkTitle: string
  /** Resolved URL (`/api/speakers/:id/photo`) once persisted; empty if no photo on file. */
  photoUrl: string
  createdAt: string
  updatedAt: string
}

export interface SaveSpeakerInput {
  id?: string
  name: string
  title: string
  company: string
  talkTitle: string
  /** Either a `data:image/...;base64,…` data URL (new upload), an existing photo URL, or '' to keep the existing photo. */
  photo: string
}

async function ensureDir() {
  await fs.mkdir(SPEAKERS_DIR, { recursive: true })
}

function entryDir(id: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    throw new Error(`Invalid speaker id: ${id}`)
  }
  return path.join(SPEAKERS_DIR, id)
}

function newId() {
  const t = Date.now().toString(36)
  const r = Math.random().toString(36).slice(2, 8)
  return `${t}-${r}`
}

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}

const DATA_URL_RE = /^data:([^;,]+);base64,(.+)$/

async function clearExistingPhoto(dir: string) {
  try {
    for (const f of await fs.readdir(dir)) {
      if (f.startsWith('photo.')) {
        await fs.rm(path.join(dir, f), { force: true })
      }
    }
  } catch {
    // Dir doesn't exist yet — nothing to clean.
  }
}

async function persistPhoto(
  id: string,
  dir: string,
  photo: string,
  version: string,
): Promise<string> {
  if (!photo) {
    // Explicit clear — delete any prior photo and return empty URL.
    await clearExistingPhoto(dir)
    return ''
  }
  if (!photo.startsWith('data:')) {
    // Already a URL (likely re-saving without touching the file) —
    // leave the photo on disk untouched and re-use the same URL.
    return photo
  }
  const match = DATA_URL_RE.exec(photo)
  if (!match) {
    await clearExistingPhoto(dir)
    return ''
  }
  const [, mime, b64] = match
  const ext = MIME_EXT[mime.toLowerCase()] ?? 'bin'
  await clearExistingPhoto(dir)
  await fs.writeFile(path.join(dir, `photo.${ext}`), Buffer.from(b64, 'base64'))
  // The asset route serves /api/speakers/:id/photo regardless of query
  // string, but browsers cache by full URL — appending a version stamp
  // tied to this save's timestamp forces a re-fetch when the file
  // changes. Without it, cached HTTP responses keep showing the old
  // image until the 5-minute max-age expires.
  return `/api/speakers/${encodeURIComponent(id)}/photo?v=${encodeURIComponent(version)}`
}

export const listSpeakers = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<SpeakerRecord>> => {
    await ensureDir()
    const ids = (await fs.readdir(SPEAKERS_DIR, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
    const entries = await Promise.all(
      ids.map(async (id) => {
        try {
          const config = JSON.parse(
            await fs.readFile(path.join(entryDir(id), 'config.json'), 'utf8'),
          ) as SpeakerRecord
          return config
        } catch {
          return null
        }
      }),
    )
    return entries
      .filter((e): e is SpeakerRecord => e !== null)
      .sort((a, b) => a.name.localeCompare(b.name))
  },
)

export const getSpeaker = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<SpeakerRecord> => {
    const config = JSON.parse(
      await fs.readFile(path.join(entryDir(data.id), 'config.json'), 'utf8'),
    ) as SpeakerRecord
    return config
  })

export const saveSpeaker = createServerFn({ method: 'POST' })
  .inputValidator((data: SaveSpeakerInput) => data)
  .handler(async ({ data }): Promise<SpeakerRecord> => {
    await ensureDir()
    const id = data.id ?? newId()
    const dir = entryDir(id)
    await fs.mkdir(dir, { recursive: true })

    const now = new Date().toISOString()
    let createdAt = now
    try {
      const existing = JSON.parse(
        await fs.readFile(path.join(dir, 'config.json'), 'utf8'),
      ) as SpeakerRecord
      createdAt = existing.createdAt ?? now
    } catch {
      // New record.
    }

    const photoUrl = await persistPhoto(id, dir, data.photo, now)

    const entry: SpeakerRecord = {
      id,
      name: data.name.trim(),
      title: data.title.trim(),
      company: data.company.trim(),
      talkTitle: data.talkTitle.trim(),
      photoUrl,
      createdAt,
      updatedAt: now,
    }

    await fs.writeFile(
      path.join(dir, 'config.json'),
      JSON.stringify(entry, null, 2),
      'utf8',
    )

    return entry
  })

export const deleteSpeaker = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<{ id: string }> => {
    await fs.rm(entryDir(data.id), { recursive: true, force: true })
    return { id: data.id }
  })
