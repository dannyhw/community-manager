import { createServerFn } from '@tanstack/react-start'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// Event library lives at `data/events/<id>/config.json`. Records bundle
// the "when/where/what" fields a meetup edition needs so the studio's
// event picker can populate them in one click. Text-only — no assets.

const EVENTS_DIR = path.resolve(process.cwd(), 'data/events')

export interface EventRecord {
  id: string
  /** Human-friendly label shown in the library card (e.g. "June 2026 · AI"). */
  name: string
  date: string
  doors: string
  venue: string
  pill: string
  url: string
  editionTag: string
  editionMark: string
  hashTag: string
  talksTheme: string
  createdAt: string
  updatedAt: string
}

export type SaveEventInput = Omit<EventRecord, 'createdAt' | 'updatedAt'> & {
  id?: string
}

async function ensureDir() {
  await fs.mkdir(EVENTS_DIR, { recursive: true })
}

function entryDir(id: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    throw new Error(`Invalid event id: ${id}`)
  }
  return path.join(EVENTS_DIR, id)
}

function newId() {
  const t = Date.now().toString(36)
  const r = Math.random().toString(36).slice(2, 8)
  return `${t}-${r}`
}

export const listEvents = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<EventRecord>> => {
    await ensureDir()
    const ids = (await fs.readdir(EVENTS_DIR, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
    const entries = await Promise.all(
      ids.map(async (id) => {
        try {
          const config = JSON.parse(
            await fs.readFile(path.join(entryDir(id), 'config.json'), 'utf8'),
          ) as EventRecord
          return config
        } catch {
          return null
        }
      }),
    )
    return entries
      .filter((e): e is EventRecord => e !== null)
      // Newest first — events tend to be referenced by recency, not name.
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },
)

export const getEvent = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<EventRecord> => {
    const config = JSON.parse(
      await fs.readFile(path.join(entryDir(data.id), 'config.json'), 'utf8'),
    ) as EventRecord
    return config
  })

export const saveEvent = createServerFn({ method: 'POST' })
  .inputValidator((data: SaveEventInput) => data)
  .handler(async ({ data }): Promise<EventRecord> => {
    await ensureDir()
    const id = data.id ?? newId()
    const dir = entryDir(id)
    await fs.mkdir(dir, { recursive: true })

    const now = new Date().toISOString()
    let createdAt = now
    try {
      const existing = JSON.parse(
        await fs.readFile(path.join(dir, 'config.json'), 'utf8'),
      ) as EventRecord
      createdAt = existing.createdAt ?? now
    } catch {
      // New record.
    }

    const entry: EventRecord = {
      id,
      name: data.name.trim(),
      date: data.date.trim(),
      doors: data.doors.trim(),
      venue: data.venue.trim(),
      pill: data.pill.trim(),
      url: data.url.trim(),
      editionTag: data.editionTag.trim(),
      editionMark: data.editionMark.trim(),
      hashTag: data.hashTag.trim(),
      talksTheme: data.talksTheme.trim(),
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

export const deleteEvent = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<{ id: string }> => {
    await fs.rm(entryDir(data.id), { recursive: true, force: true })
    return { id: data.id }
  })
