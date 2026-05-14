import { createFileRoute } from '@tanstack/react-router'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// GET /api/gallery/:id/asset/:key — streams a binary upload that was
// peeled out of `values` at save time (see persistAssets in
// src/server/gallery.ts). The Content-Type is derived from the file's
// extension on disk because the key alone doesn't say what kind of
// image the user uploaded.

const GALLERY_DIR = path.resolve(process.cwd(), 'data/gallery')

// Strict allowlist for both segments. Keys are user-supplied (template
// field names) so we want a clean character class even though the only
// realistic value today is `speakerImage`.
const SAFE_RE = /^[A-Za-z0-9_-]+$/

const EXT_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  svg: 'image/svg+xml',
}

export const Route = createFileRoute('/api/gallery/$id/asset/$key')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        if (!SAFE_RE.test(params.id) || !SAFE_RE.test(params.key)) {
          return new Response('Invalid id or key', { status: 400 })
        }
        const assetsDir = path.join(GALLERY_DIR, params.id, 'assets')
        let file: string | null = null
        let ext = ''
        try {
          // We saved the asset as `<key>.<ext>` but `<ext>` depends on
          // the upload's MIME, so we have to scan the dir.
          for (const f of await fs.readdir(assetsDir)) {
            if (f.startsWith(`${params.key}.`)) {
              file = path.join(assetsDir, f)
              ext = f.slice(params.key.length + 1).toLowerCase()
              break
            }
          }
        } catch {
          return new Response('Not found', { status: 404 })
        }
        if (!file) return new Response('Not found', { status: 404 })

        try {
          const stat = await fs.stat(file)
          const etag = `"${stat.mtimeMs.toString(36)}-${stat.size.toString(36)}"`
          const ifNoneMatch = request.headers.get('if-none-match')
          if (
            ifNoneMatch &&
            ifNoneMatch
              .split(',')
              .map((s) => s.trim())
              .includes(etag)
          ) {
            return new Response(null, {
              status: 304,
              headers: {
                ETag: etag,
                'Cache-Control': 'private, max-age=300, must-revalidate',
              },
            })
          }
          const bytes = await fs.readFile(file)
          const body = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
          return new Response(body, {
            headers: {
              'Content-Type': EXT_MIME[ext] ?? 'application/octet-stream',
              'Content-Length': stat.size.toString(),
              'Cache-Control': 'private, max-age=300, must-revalidate',
              ETag: etag,
            },
          })
        } catch {
          return new Response('Not found', { status: 404 })
        }
      },
    },
  },
})
