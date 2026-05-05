import { bannerCommunity } from './BannerCommunity'
import { bannerGlance } from './BannerGlance'
import { bannerSimple } from './BannerSimple'
import { bannerSpeakerPortrait, bannerSpeakerSquare } from './BannerSpeaker'
import { bannerStory } from './BannerStory'
import { bannerTicket, bannerTicketAI } from './BannerTicket'
import { bannerTicketAISquare } from './BannerTicketAISquare'
import { bannerWide } from './BannerWide'
import type { GraphicTemplate } from './types'

export const templates: Array<GraphicTemplate> = [
  bannerWide,
  bannerGlance,
  bannerSimple,
  bannerTicket,
  bannerTicketAI,
  bannerTicketAISquare,
  bannerStory,
  bannerSpeakerSquare,
  bannerSpeakerPortrait,
  bannerCommunity,
]

export const templatesById: Record<string, GraphicTemplate> = Object.fromEntries(
  templates.map((t) => [t.id, t]),
)

export type { GraphicTemplate, TemplateValues } from './types'
