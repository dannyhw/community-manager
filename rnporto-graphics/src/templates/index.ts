import { bannerCommunity } from './BannerCommunity'
import { bannerGlance } from './BannerGlance'
import { bannerSimple } from './BannerSimple'
import {
  bannerSpeakerLandscape,
  bannerSpeakerPortrait,
  bannerSpeakerSquare,
  bannerSpeakerStory,
} from './BannerSpeaker'
import {
  bannerSpeakers3,
  bannerSpeakers3Landscape,
  bannerSpeakers3Square,
} from './BannerSpeakers3'
import {
  bannerSpeakers3Hero,
  bannerSpeakers3HeroLandscape,
  bannerSpeakers3HeroSquare,
} from './BannerSpeakers3Hero'
import {
  bannerSpeakers3Triptych,
  bannerSpeakers3TriptychLandscape,
  bannerSpeakers3TriptychSquare,
} from './BannerSpeakers3Triptych'
import { bannerStory } from './BannerStory'
import { bannerTicket, bannerTicketAI } from './BannerTicket'
import { bannerTicketAISquare } from './BannerTicketAISquare'
import { bannerWide } from './BannerWide'
import type { GraphicTemplate } from './types'

export interface TemplateGroup {
  id: string
  /** Tab label shown in the studio picker. */
  label: string
  templates: Array<GraphicTemplate>
}

// Grouping is the source of truth for how templates surface in the picker.
// Many templates are the same design at different aspect ratios, so they
// live together under one family tab. To add a template, drop it into the
// right group here (or start a new group) — the studio picks it up
// automatically, same as before.
export const templateGroups: Array<TemplateGroup> = [
  {
    id: 'event',
    label: 'Event',
    templates: [bannerWide, bannerGlance, bannerSimple, bannerStory],
  },
  {
    id: 'ticket',
    label: 'Ticket',
    templates: [bannerTicket, bannerTicketAI, bannerTicketAISquare],
  },
  {
    id: 'speaker',
    label: 'Speaker',
    templates: [
      bannerSpeakerSquare,
      bannerSpeakerPortrait,
      bannerSpeakerLandscape,
      bannerSpeakerStory,
    ],
  },
  {
    id: 'speakers-3',
    label: 'Speakers ×3',
    templates: [
      bannerSpeakers3,
      bannerSpeakers3Square,
      bannerSpeakers3Landscape,
      bannerSpeakers3Hero,
      bannerSpeakers3HeroSquare,
      bannerSpeakers3HeroLandscape,
      bannerSpeakers3Triptych,
      bannerSpeakers3TriptychSquare,
      bannerSpeakers3TriptychLandscape,
    ],
  },
  {
    id: 'community',
    label: 'Community',
    templates: [bannerCommunity],
  },
]

// Flat list derived from the groups, for everything that just needs to look
// a template up or iterate them all (gallery, default selection, value seeds).
export const templates: Array<GraphicTemplate> = templateGroups.flatMap(
  (group) => group.templates,
)

export const templatesById: Record<string, GraphicTemplate> = Object.fromEntries(
  templates.map((t) => [t.id, t]),
)

export type { GraphicTemplate, TemplateValues } from './types'
