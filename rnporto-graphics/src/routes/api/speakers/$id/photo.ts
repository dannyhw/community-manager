import { createFileRoute } from '@tanstack/react-router'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// GET /api/speakers/:id/photo — streams the saved speaker photo. Mirrors
// the gallery asset route: extension on disk determines the response
// MIME type since `photo` alone doesn't say what format the upload was.

const SPEAKERS_DIR = path.resolve(process.cwd(), 'data/speakers')
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

export const Route = createFileRoute('/api/speakers/$id/photo')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        if (!SAFE_RE.test(params.id)) {
          return new Response('Invalid id', { status: 400 })
        }
        const dir = path.join(SPEAKERS_DIR, params.id)
        let file: string | null = null
        let ext = ''
        try {
          for (const f of await fs.readdir(dir)) {
            if (f.startsWith('photo.')) {
              file = path.join(dir, f)
              ext = f.slice('photo.'.length).toLowerCase()
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
