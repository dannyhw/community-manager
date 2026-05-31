import { useQuery } from '@tanstack/react-query'
import { listSpeakers, type SpeakerRecord } from '../server/speakers'
import type { GraphicTemplate } from '../templates/types'

export function useSpeakersList() {
  return useQuery({
    queryKey: ['speakers', 'list'],
    queryFn: () => listSpeakers(),
    staleTime: 60_000,
  })
}

// Detect which speaker slot a field belongs to.
//   speakerName          → ''   (single-speaker templates)
//   speaker1Name         → '1'
//   speaker2Role         → '2'
//   speaker3Image        → '3'
// Returns null for fields that aren't part of a speaker slot.
const SLOT_RE = /^speaker(\d?)(Name|Role|Image|ImageCrop)$/

export function slotOfField(key: string): string | null {
  const m = SLOT_RE.exec(key)
  return m ? m[1] : null
}

// Format a speaker's title + company into the single `role` string the
// templates render. We match the convention seen in the existing
// defaults: `${title} · ${company}` when both are present, else
// whichever one is filled in. Falls back to '' so the field clears
// cleanly when both are blank.
export function formatRole(speaker: { title: string; company: string }): string {
  const title = speaker.title.trim()
  const company = speaker.company.trim()
  if (title && company) return `${title} · ${company}`
  return title || company
}

// Builds the `{ field → value }` patch that applying `speaker` to the
// given slot should produce. Caller iterates the patch and calls
// `onChange` per key. `template` lets us only emit keys the active
// template actually has — e.g. talkTitle is only written when the
// current template exposes it.
export function buildApplyPatch(
  speaker: SpeakerRecord,
  slot: string,
  template: GraphicTemplate,
): Record<string, string> {
  const has = (key: string) => template.fields.some((f) => f.key === key)
  const patch: Record<string, string> = {}
  const nameKey = `speaker${slot}Name`
  const roleKey = `speaker${slot}Role`
  const imageKey = `speaker${slot}Image`
  if (has(nameKey)) patch[nameKey] = speaker.name
  if (has(roleKey)) patch[roleKey] = formatRole(speaker)
  if (has(imageKey) && speaker.photoUrl) patch[imageKey] = speaker.photoUrl
  if (has('talkTitle')) patch.talkTitle = speaker.talkTitle
  return patch
}

// All speaker slot prefixes the active template exposes. Used by the
// editor to render a picker button per slot.
export function templateSlots(template: GraphicTemplate): Array<string> {
  const slots = new Set<string>()
  for (const f of template.fields) {
    const s = slotOfField(f.key)
    if (s !== null) slots.add(s)
  }
  return Array.from(slots).sort()
}
