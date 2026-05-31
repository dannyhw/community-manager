import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { listGraphics } from '../server/gallery'

// Fields fully covered by the speaker picker — skipped during suggestion
// building so the editor doesn't double up with inline "From gallery"
// chips for data that one click on the picker already fills in.
const PICKER_OWNED_KEYS = new Set<string>([
  'speakerName',
  'speaker1Name',
  'speaker2Name',
  'speaker3Name',
  'speakerRole',
  'speaker1Role',
  'speaker2Role',
  'speaker3Role',
  'speakerImage',
  'speaker1Image',
  'speaker2Image',
  'speaker3Image',
  'talkTitle',
])

interface SuggestionInput {
  values: Record<string, string>
  updatedAt: string
}

export function buildSuggestions(
  entries: Array<SuggestionInput>,
): Record<string, Array<string>> {
  // Newest first so the first time a value is seen (and added to its
  // Set) is the most recent occurrence. Set insertion order is preserved
  // on iteration, which gives us implicit recency ordering for free.
  const sorted = [...entries].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )
  const byKey = new Map<string, Set<string>>()
  for (const entry of sorted) {
    for (const [key, value] of Object.entries(entry.values)) {
      if (!value) continue
      if (PICKER_OWNED_KEYS.has(key)) continue
      let set = byKey.get(key)
      if (!set) {
        set = new Set<string>()
        byKey.set(key, set)
      }
      set.add(value)
    }
  }
  const out: Record<string, Array<string>> = {}
  for (const [key, set] of byKey) out[key] = Array.from(set)
  return out
}

export type Suggestions = Record<string, Array<string>>

export function useSuggestions(): Suggestions {
  const { data } = useQuery({
    queryKey: ['gallery', 'list'],
    queryFn: () => listGraphics(),
    staleTime: 60_000,
  })
  return useMemo(() => buildSuggestions(data ?? []), [data])
}
