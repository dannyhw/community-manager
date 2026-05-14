import { createFileRoute } from '@tanstack/react-router'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// GET /api/gallery/:id/thumb — streams the on-disk thumbnail PNG with the
// right Content-Type so the browser can render it via a regular <img src>.
// We used to inline the thumbnail in the gallery-listing JSON as a base64
// data URL; that doubled the wire size and defeated HTTP caching. Now the
// listing returns metadata only and each card hits this route lazily.

const GALLERY_DIR = path.resolve(process.cwd(), 'data/gallery')

// Mirrors the validator in src/server/gallery.ts. Kept inline so this
// route doesn't import the server module (and drag its `fs` usage into
// the client bundle's import graph).
function entryDir(id: string): string | null {
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return null
  return path.join(GALLERY_DIR, id)
}

export const Route = createFileRoute('/api/gallery/$id/thumb')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const dir = entryDir(params.id)
        if (!dir) {
          return new Response('Invalid id', { status: 400 })
        }
        try {
          const file = path.join(dir, 'thumb.png')
          const stat = await fs.stat(file)
          // ETag from mtime + size — both change on overwrite, neither
          // changes between reads, so the browser can revalidate cheaply.
          const etag = `"${stat.mtimeMs.toString(36)}-${stat.size.toString(36)}"`

          // Conditional GET: if the client already has this exact
          // version, hand back a 304 without re-reading the file. The
          // header may contain a comma-separated list of candidate
          // ETags, so we check membership rather than equality.
          const ifNoneMatch = request.headers.get('if-none-match')
          if (ifNoneMatch && ifNoneMatch.split(',').map((s) => s.trim()).includes(etag)) {
            return new Response(null, {
              status: 304,
              headers: {
                ETag: etag,
                'Cache-Control': 'private, max-age=300, must-revalidate',
              },
            })
          }

          const bytes = await fs.readFile(file)
          // The body has to be a fresh Uint8Array (not a Node Buffer
          // backed by a slice of a pool) so the runtime doesn't choke
          // on a non-owned ArrayBuffer.
          const body = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
          return new Response(body, {
            headers: {
              'Content-Type': 'image/png',
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
