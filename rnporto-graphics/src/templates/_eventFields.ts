import type { TemplateField, TemplateValues } from './types'

// Shared field definitions for event-edition banners (Wide / Story / Glance /
// Simple / Ticket / TicketAI / TicketAISquare). Each banner picks the subset
// it actually renders and merges its own per-template defaults.

export const eventFields = {
  editionMark: {
    key: 'editionMark',
    label: 'Edition number',
    type: 'text',
    placeholder: '02',
  } satisfies TemplateField,
  editionTag: {
    key: 'editionTag',
    label: 'Edition tag',
    type: 'text',
    placeholder: 'Edition #02 · June meetup',
  } satisfies TemplateField,
  hashTag: {
    key: 'hashTag',
    label: 'Hash mark',
    type: 'text',
    placeholder: '# RNP–002',
  } satisfies TemplateField,
  brand: {
    key: 'brand',
    label: 'Brand wordmark',
    type: 'text',
    placeholder: 'React Native Porto',
  } satisfies TemplateField,
  titleLine1: {
    key: 'titleLine1',
    label: 'Title — line 1',
    type: 'text',
    placeholder: 'React Native.',
  } satisfies TemplateField,
  titleLine2: {
    key: 'titleLine2',
    label: 'Title — line 2 (accent)',
    type: 'text',
    placeholder: 'AI Native.',
  } satisfies TemplateField,
  body: {
    key: 'body',
    label: 'Body / subtitle',
    type: 'textarea',
    placeholder: 'An evening on AI-native workflows for React Native…',
  } satisfies TemplateField,
  date: {
    key: 'date',
    label: 'Date',
    type: 'text',
    placeholder: 'Thu 11 Jun',
  } satisfies TemplateField,
  doors: {
    key: 'doors',
    label: 'Doors',
    type: 'text',
    placeholder: '18:00',
  } satisfies TemplateField,
  venue: {
    key: 'venue',
    label: 'Venue',
    type: 'text',
    placeholder: 'Porto Innovation Hub',
  } satisfies TemplateField,
  pill: {
    key: 'pill',
    label: 'Pill text',
    type: 'text',
    placeholder: 'Free · RSVP open',
  } satisfies TemplateField,
  url: {
    key: 'url',
    label: 'Meetup URL',
    type: 'text',
    placeholder: 'meetup.com/react-native-porto',
  } satisfies TemplateField,
  hostLine1: {
    key: 'hostLine1',
    label: 'Host — line 1',
    type: 'text',
    placeholder: 'Porto Innovation',
  } satisfies TemplateField,
  hostLine2: {
    key: 'hostLine2',
    label: 'Host — line 2',
    type: 'text',
    placeholder: 'Hub',
  } satisfies TemplateField,
  barcodeCaption: {
    key: 'barcodeCaption',
    label: 'Barcode caption',
    type: 'text',
    placeholder: 'RNP 002 · 11 06 26',
  } satisfies TemplateField,
}

export const eventDefaults: TemplateValues = {
  editionMark: '02',
  editionTag: 'Edition #02 · June meetup',
  hashTag: '# RNP–002',
  brand: 'React Native Porto',
  titleLine1: 'React Native.',
  titleLine2: 'AI Native.',
  body:
    'An evening on AI-native workflows for React Native — with the people building it in Portugal. Pizza and Super Bock on us.',
  date: 'Thu 11 Jun',
  doors: '18:00',
  venue: 'Porto Innovation Hub',
  pill: 'Free · RSVP open',
  url: 'meetup.com/react-native-porto',
  hostLine1: 'Porto Innovation',
  hostLine2: 'Hub',
  barcodeCaption: 'RNP 002 · 11 06 26',
}

// Deterministic barcode strip — same seed as the original banner.jsx so the
// rendered bars match the design.
const SEED = [3, 2, 5, 2, 3, 4, 2, 5, 3, 2, 4, 2, 3, 5, 2, 3, 4, 2, 5, 3, 2, 3, 4, 2, 5, 3, 2, 4]

export function buildBars(maxX: number, height: number) {
  const out: Array<{ x: number; w: number; h: number }> = []
  let x = 0
  let i = 0
  while (x < maxX) {
    const w = SEED[i % SEED.length]
    i++
    if (i % 2 === 1) out.push({ x, w, h: height })
    x += w + 1
  }
  return out
}
