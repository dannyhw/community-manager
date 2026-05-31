import { useQuery } from '@tanstack/react-query'
import { listEvents, type EventRecord } from '../server/events'
import type { GraphicTemplate } from '../templates/types'

export function useEventsList() {
  return useQuery({
    queryKey: ['events', 'list'],
    queryFn: () => listEvents(),
    staleTime: 60_000,
  })
}

// Field keys an event record owns. Driven by `buildEventApplyPatch`
// when applying a picked event to the active template.
export const EVENT_FIELD_KEYS = [
  'date',
  'doors',
  'venue',
  'pill',
  'url',
  'editionTag',
  'editionMark',
  'hashTag',
  'talksTheme',
] as const

export type EventFieldKey = (typeof EVENT_FIELD_KEYS)[number]

// Build the `{ field → value }` patch to apply to the active template.
// Only emit keys the template actually exposes AND that the record has a
// non-empty value for, so picking a sparsely-filled event doesn't blank
// out fields the user manually typed.
export function buildEventApplyPatch(
  event: EventRecord,
  template: GraphicTemplate,
): Record<string, string> {
  const has = (key: string) => template.fields.some((f) => f.key === key)
  const patch: Record<string, string> = {}
  for (const key of EVENT_FIELD_KEYS) {
    const value = event[key]
    if (value && has(key)) patch[key] = value
  }
  return patch
}
