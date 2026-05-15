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
  speakerImage: {
    key: 'speakerImage',
    label: 'Speaker photo',
    type: 'image',
  } satisfies TemplateField,
  speakerImageCrop: {
    key: 'speakerImageCrop',
    label: 'Photo crop',
    type: 'select',
    options: [
      { value: 'center 0%', label: 'Top' },
      { value: 'center 20%', label: 'Face (top bias)' },
      { value: 'center 50%', label: 'Center' },
      { value: 'center 80%', label: 'Lower' },
      { value: 'center 100%', label: 'Bottom' },
    ],
  } satisfies TemplateField,
  speakerName: {
    key: 'speakerName',
    label: 'Speaker name',
    type: 'text',
    placeholder: 'Joana Almeida',
  } satisfies TemplateField,
  speakerRole: {
    key: 'speakerRole',
    label: 'Speaker role',
    type: 'text',
    placeholder: 'Staff Engineer · Reanimated',
  } satisfies TemplateField,
  talkTitle: {
    key: 'talkTitle',
    label: 'Talk title (Enter for manual line break)',
    type: 'textarea',
    placeholder: 'Reanimated 4 in production',
  } satisfies TemplateField,
  speaker1Image: {
    key: 'speaker1Image',
    label: 'Speaker 1 photo',
    type: 'image',
  } satisfies TemplateField,
  speaker1ImageCrop: {
    key: 'speaker1ImageCrop',
    label: 'Speaker 1 crop',
    type: 'select',
    options: [
      { value: 'center 0%', label: 'Top' },
      { value: 'center 20%', label: 'Face (top bias)' },
      { value: 'center 50%', label: 'Center' },
      { value: 'center 80%', label: 'Lower' },
      { value: 'center 100%', label: 'Bottom' },
    ],
  } satisfies TemplateField,
  speaker1Name: {
    key: 'speaker1Name',
    label: 'Speaker 1 name',
    type: 'text',
    placeholder: 'Joana Almeida',
  } satisfies TemplateField,
  speaker1Role: {
    key: 'speaker1Role',
    label: 'Speaker 1 role',
    type: 'text',
    placeholder: 'Staff Engineer · Reanimated',
  } satisfies TemplateField,
  speaker2Image: {
    key: 'speaker2Image',
    label: 'Speaker 2 photo',
    type: 'image',
  } satisfies TemplateField,
  speaker2ImageCrop: {
    key: 'speaker2ImageCrop',
    label: 'Speaker 2 crop',
    type: 'select',
    options: [
      { value: 'center 0%', label: 'Top' },
      { value: 'center 20%', label: 'Face (top bias)' },
      { value: 'center 50%', label: 'Center' },
      { value: 'center 80%', label: 'Lower' },
      { value: 'center 100%', label: 'Bottom' },
    ],
  } satisfies TemplateField,
  speaker2Name: {
    key: 'speaker2Name',
    label: 'Speaker 2 name',
    type: 'text',
    placeholder: 'Miguel Ferreira',
  } satisfies TemplateField,
  speaker2Role: {
    key: 'speaker2Role',
    label: 'Speaker 2 role',
    type: 'text',
    placeholder: 'Mobile Lead · Talkdesk',
  } satisfies TemplateField,
  speaker3Image: {
    key: 'speaker3Image',
    label: 'Speaker 3 photo',
    type: 'image',
  } satisfies TemplateField,
  speaker3ImageCrop: {
    key: 'speaker3ImageCrop',
    label: 'Speaker 3 crop',
    type: 'select',
    options: [
      { value: 'center 0%', label: 'Top' },
      { value: 'center 20%', label: 'Face (top bias)' },
      { value: 'center 50%', label: 'Center' },
      { value: 'center 80%', label: 'Lower' },
      { value: 'center 100%', label: 'Bottom' },
    ],
  } satisfies TemplateField,
  speaker3Name: {
    key: 'speaker3Name',
    label: 'Speaker 3 name',
    type: 'text',
    placeholder: 'Sofia Rocha',
  } satisfies TemplateField,
  speaker3Role: {
    key: 'speaker3Role',
    label: 'Speaker 3 role',
    type: 'text',
    placeholder: 'Founder · Tinta Labs',
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
  speakerImage: '',
  speakerImageCrop: 'center 20%',
  speakerName: 'Joana Almeida',
  speakerRole: 'Staff Engineer · Reanimated',
  talkTitle: 'Reanimated 4 in production',
  speaker1Image: '',
  speaker1ImageCrop: 'center 20%',
  speaker1Name: 'Joana Almeida',
  speaker1Role: 'Staff Engineer · Reanimated',
  speaker2Image: '',
  speaker2ImageCrop: 'center 20%',
  speaker2Name: 'Miguel Ferreira',
  speaker2Role: 'Mobile Lead · Talkdesk',
  speaker3Image: '',
  speaker3ImageCrop: 'center 20%',
  speaker3Name: 'Sofia Rocha',
  speaker3Role: 'Founder · Tinta Labs',
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
