import { BannerHalftone } from "../system/Halftone";
import { MotifAtom } from "../system/MotifAtom";
import type { ThemeTokens } from "../system/tokens";
import { eventDefaults, eventFields } from "./_eventFields";
import type { GraphicTemplate, TemplateValues } from "./types";

type Variant = "story" | "square" | "landscape";

interface VariantConfig {
  width: number;
  height: number;
  // "stacked" — hero panel on top, photos below, URL footer at the bottom.
  // "split"   — hero panel on the left, photos on the right; URL pinned to
  //             the bottom of the hero panel, no separate footer.
  layout: "stacked" | "split";
  heroHeight: number;
  leftPanelWidth: number;
  footerHeight: number;
  heroPadding: string;
  motifSize: number;
  eyebrowSize: number;
  brandLetterSpacing: string;
  editionSize: number;
  // editionInline=true keeps the edition tag on the same row as the brand
  // (stacked layouts). When false (narrow split layout) it drops to its own
  // line under the brand row.
  editionInline: boolean;
  editionMarginTop: number;
  // Some variants (landscape) drop the edition tag entirely to give the
  // hero text more vertical room.
  showEditionTag: boolean;
  dateSize: number;
  dateMarginTop: number;
  // Per-variant letter-spacing override so a narrow panel (landscape) can
  // pack more text into a single line without re-sizing the headline.
  dateLetterSpacing: string;
  venueSize: number;
  venueMarginTop: number;
  venueLetterSpacing: string;
  pillMarginTop: number;
  pillFontSize: number;
  pillPadding: string;
  bodyPadding: string;
  featuringSize: number;
  featuringGap: number;
  photoWidth: number;
  photoGap: number;
  captionHeight: number;
  captionMarginTop: number;
  nameSize: number;
  roleSize: number;
  talkTitleSize: number;
  footerFontSize: number;
  cardRadius: number;
  cardNamePadding: string;
  cardOverlayHeight: number;
  // Halftone density for the accent panel. Per-variant because the same
  // grid that looks airy on a 1080×1920 panel ends up looking noisy on a
  // 412×600 one.
  halftoneCols: number;
  halftoneRows: number;
  halftoneMaxOpacity: number;
}

const VARIANTS: Record<Variant, VariantConfig> = {
  story: {
    width: 1080,
    height: 1920,
    layout: "stacked",
    heroHeight: 580,
    leftPanelWidth: 0,
    footerHeight: 88,
    heroPadding: "56px 60px 60px",
    motifSize: 36,
    eyebrowSize: 22,
    brandLetterSpacing: "0.22em",
    editionSize: 20,
    editionInline: true,
    editionMarginTop: 0,
    showEditionTag: true,
    dateSize: 130,
    dateMarginTop: 56,
    dateLetterSpacing: "-0.045em",
    venueSize: 96,
    venueMarginTop: 20,
    venueLetterSpacing: "-0.035em",
    pillMarginTop: 28,
    pillFontSize: 22,
    pillPadding: "14px 24px",
    bodyPadding: "48px 60px 24px",
    featuringSize: 20,
    featuringGap: 32,
    photoWidth: 320,
    photoGap: 18,
    captionHeight: 110,
    captionMarginTop: 18,
    nameSize: 26,
    roleSize: 15,
    talkTitleSize: 22,
    footerFontSize: 22,
    cardRadius: 26,
    cardNamePadding: "0 18px 22px",
    cardOverlayHeight: 260,
    halftoneCols: 60,
    halftoneRows: 50,
    halftoneMaxOpacity: 0.2,
  },
  square: {
    width: 1080,
    height: 1080,
    layout: "stacked",
    heroHeight: 432,
    leftPanelWidth: 0,
    footerHeight: 64,
    heroPadding: "40px 50px 44px",
    motifSize: 28,
    eyebrowSize: 17,
    brandLetterSpacing: "0.22em",
    editionSize: 15,
    editionInline: true,
    editionMarginTop: 0,
    showEditionTag: true,
    dateSize: 108,
    dateMarginTop: 28,
    dateLetterSpacing: "-0.045em",
    venueSize: 76,
    venueMarginTop: 14,
    venueLetterSpacing: "-0.035em",
    pillMarginTop: 20,
    pillFontSize: 17,
    pillPadding: "10px 18px",
    bodyPadding: "32px 50px 18px",
    featuringSize: 16,
    featuringGap: 22,
    photoWidth: 308,
    photoGap: 16,
    captionHeight: 78,
    captionMarginTop: 14,
    nameSize: 22,
    roleSize: 13,
    talkTitleSize: 18,
    footerFontSize: 16,
    cardRadius: 22,
    cardNamePadding: "0 14px 16px",
    cardOverlayHeight: 200,
    halftoneCols: 60,
    halftoneRows: 50,
    halftoneMaxOpacity: 0.2,
  },
  landscape: {
    width: 1024,
    height: 600,
    layout: "split",
    heroHeight: 0,
    leftPanelWidth: 412,
    footerHeight: 0,
    heroPadding: "30px 20px 28px",
    motifSize: 38,
    eyebrowSize: 19,
    brandLetterSpacing: "0.16em",
    editionSize: 12,
    editionInline: false,
    editionMarginTop: 14,
    showEditionTag: false,
    dateSize: 82,
    dateMarginTop: 30,
    // Tight tracking lets "Thu 11 Jun" sit on a single line in the narrow
    // panel without dropping the type size.
    dateLetterSpacing: "-0.06em",
    venueSize: 48,
    venueMarginTop: 14,
    venueLetterSpacing: "-0.05em",
    pillMarginTop: 22,
    pillFontSize: 14,
    pillPadding: "8px 16px",
    bodyPadding: "30px 20px 28px",
    featuringSize: 13,
    featuringGap: 20,
    photoWidth: 178,
    photoGap: 12,
    captionHeight: 60,
    captionMarginTop: 14,
    nameSize: 18,
    roleSize: 12,
    talkTitleSize: 14,
    footerFontSize: 15,
    cardRadius: 18,
    cardNamePadding: "0 12px 14px",
    cardOverlayHeight: 140,
    halftoneCols: 26,
    halftoneRows: 36,
    halftoneMaxOpacity: 0.11,
  },
};

function SpeakerCard({
  src,
  crop,
  name,
  role,
  talkTitle,
  t,
  cfg,
}: {
  src: string;
  crop: string;
  name: string;
  role: string;
  talkTitle: string;
  t: ThemeTokens;
  cfg: VariantConfig;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: cfg.photoWidth,
        flex: "none",
        minHeight: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          borderRadius: cfg.cardRadius,
          overflow: "hidden",
          background: t.accent,
          color: t.accentInk,
        }}
      >
        <BannerHalftone
          color={t.accentInk}
          cols={22}
          rows={48}
          dot={1.4}
          direction="vertical"
          minOpacity={0.04}
          maxOpacity={0.28}
        />
        {src ? (
          <img
            src={src}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: crop || "center 20%",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ opacity: 0.35 }}>
              <MotifAtom
                color={t.accentInk}
                size={cfg.photoWidth * 0.55}
                strokeWidth={1.2}
              />
            </div>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: cfg.cardOverlayHeight,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.32) 75%, rgba(0,0,0,0) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: cfg.cardNamePadding,
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: cfg.nameSize,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textWrap: "balance",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: t.fonts.mono,
              fontSize: cfg.roleSize,
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
              marginTop: 8,
              letterSpacing: "0.02em",
              lineHeight: 1.3,
              textWrap: "balance",
            }}
          >
            {role}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: cfg.captionMarginTop,
          height: cfg.captionHeight,
          flex: "none",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: cfg.talkTitleSize,
            fontWeight: 600,
            lineHeight: 1.15,
            color: t.fg.primary,
            letterSpacing: "-0.015em",
            textWrap: "balance",
            whiteSpace: "pre-line",
          }}
        >
          {talkTitle}
        </div>
      </div>
    </div>
  );
}

function HeroPanelContent({
  values,
  t,
  cfg,
}: {
  values: TemplateValues;
  t: ThemeTokens;
  cfg: VariantConfig;
}) {
  const brandRow = (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <MotifAtom color={t.accentInk} size={cfg.motifSize} strokeWidth={1.5} />
      <span
        style={{
          fontFamily: t.fonts.mono,
          fontSize: cfg.eyebrowSize,
          fontWeight: 600,
          letterSpacing: cfg.brandLetterSpacing,
          textTransform: "uppercase",
        }}
      >
        {values.brand}
      </span>
    </div>
  );

  const editionTag = (
    <span
      style={{
        fontFamily: t.fonts.mono,
        fontSize: cfg.editionSize,
        fontWeight: 600,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        opacity: 0.94,
        padding: "8px 16px",
        border: `1.5px solid ${t.accentInk}`,
        borderRadius: 999,
        whiteSpace: "nowrap",
        alignSelf: "flex-start",
      }}
    >
      {values.editionTag}
    </span>
  );

  return (
    <>
      {cfg.editionInline ? (
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flex: "none",
          }}
        >
          {brandRow}
          {cfg.showEditionTag && editionTag}
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: "none",
          }}
        >
          {brandRow}
          {cfg.showEditionTag && (
            <div style={{ marginTop: cfg.editionMarginTop }}>{editionTag}</div>
          )}
        </div>
      )}

      <div
        style={{
          position: "relative",
          marginTop: cfg.dateMarginTop,
          fontSize: cfg.dateSize,
          fontWeight: 700,
          lineHeight: 0.92,
          letterSpacing: cfg.dateLetterSpacing,
          textWrap: "balance",
          flex: "none",
        }}
      >
        {values.date}
      </div>

      <div
        style={{
          position: "relative",
          marginTop: cfg.venueMarginTop,
          fontSize: cfg.venueSize,
          fontWeight: 700,
          lineHeight: 0.96,
          letterSpacing: cfg.venueLetterSpacing,
          textWrap: "balance",
          flex: "none",
        }}
      >
        {values.venue}
      </div>

      <div
        style={{
          position: "relative",
          marginTop: cfg.pillMarginTop,
          display: "flex",
          flex: "none",
        }}
      >
        <div
          style={{
            fontFamily: t.fonts.mono,
            fontSize: cfg.pillFontSize,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: cfg.pillPadding,
            background: t.accentInk,
            color: t.accent,
            borderRadius: 999,
            whiteSpace: "nowrap",
          }}
        >
          {values.pill}
        </div>
      </div>
    </>
  );
}

function SpeakerBody({
  speakers,
  t,
  cfg,
}: {
  speakers: Array<{
    src: string;
    crop: string;
    name: string;
    role: string;
    talkTitle: string;
  }>;
  t: ThemeTokens;
  cfg: VariantConfig;
}) {
  return (
    <>
      <div
        style={{
          fontFamily: t.fonts.mono,
          fontSize: cfg.featuringSize,
          fontWeight: 600,
          letterSpacing: "0.3em",
          color: t.fg.tertiary,
          textTransform: "uppercase",
          flex: "none",
        }}
      >
        Featuring
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          marginTop: cfg.featuringGap,
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: cfg.photoGap,
        }}
      >
        {speakers.map((s, i) => (
          <SpeakerCard key={i} {...s} t={t} cfg={cfg} />
        ))}
      </div>
    </>
  );
}

function BannerSpeakers3Hero({
  values,
  t,
  variant,
}: {
  values: TemplateValues;
  t: ThemeTokens;
  variant: Variant;
}) {
  const cfg = VARIANTS[variant];
  const speakers = [1, 2, 3].map((i) => ({
    src: values[`speaker${i}Image`],
    crop: values[`speaker${i}ImageCrop`],
    name: values[`speaker${i}Name`],
    role: values[`speaker${i}Role`],
    talkTitle: values[`speaker${i}TalkTitle`],
  }));

  if (cfg.layout === "split") {
    return (
      <div
        style={{
          width: cfg.width,
          height: cfg.height,
          position: "relative",
          overflow: "hidden",
          background: t.bg.canvas,
          color: t.fg.primary,
          fontFamily: t.fonts.sans,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* HERO accent panel on the left */}
        <div
          style={{
            position: "relative",
            width: cfg.leftPanelWidth,
            height: "100%",
            flex: "none",
            background: t.accent,
            color: t.accentInk,
            padding: cfg.heroPadding,
            boxSizing: "border-box",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <BannerHalftone
            color={t.accentInk}
            cols={cfg.halftoneCols}
            rows={cfg.halftoneRows}
            dot={1.4}
            direction="vertical"
            minOpacity={0.03}
            maxOpacity={cfg.halftoneMaxOpacity}
          />

          <HeroPanelContent values={values} t={t} cfg={cfg} />

          {/* URL pinned to the bottom of the panel — sits inside a soft
              chip on the accent so it reads clearly without competing with
              the FREE pill above. */}
          <div
            style={{
              position: "relative",
              marginTop: "auto",
              paddingTop: 24,
              display: "flex",
            }}
          >
            <div
              style={{
                fontFamily: t.fonts.mono,
                fontSize: cfg.footerFontSize,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "8px 14px",
                border: `1.5px solid ${t.accentInk}`,
                borderRadius: 999,
                opacity: 0.95,
                whiteSpace: "nowrap",
              }}
            >
              {values.url}
            </div>
          </div>
        </div>

        {/* Body — three speakers, on the right */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: cfg.bodyPadding,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <SpeakerBody speakers={speakers} t={t} cfg={cfg} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: cfg.width,
        height: cfg.height,
        position: "relative",
        overflow: "hidden",
        background: t.bg.canvas,
        color: t.fg.primary,
        fontFamily: t.fonts.sans,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HERO accent panel — date + venue + free dominate; theme as eyebrow */}
      <div
        style={{
          position: "relative",
          height: cfg.heroHeight,
          background: t.accent,
          color: t.accentInk,
          padding: cfg.heroPadding,
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: "none",
        }}
      >
        <BannerHalftone
          color={t.accentInk}
          cols={cfg.halftoneCols}
          rows={cfg.halftoneRows}
          dot={1.4}
          direction="vertical"
          minOpacity={0.03}
          maxOpacity={cfg.halftoneMaxOpacity}
        />

        <HeroPanelContent values={values} t={t} cfg={cfg} />
      </div>

      {/* Body — three speakers */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: cfg.bodyPadding,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <SpeakerBody speakers={speakers} t={t} cfg={cfg} />
      </div>

      {/* Footer — meetup URL, subtle */}
      <div
        style={{
          height: cfg.footerHeight,
          flex: "none",
          padding: "0 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: `1px solid ${t.line.divider}`,
        }}
      >
        <div
          style={{
            fontFamily: t.fonts.mono,
            fontSize: cfg.footerFontSize,
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: t.fg.secondary,
            textTransform: "uppercase",
          }}
        >
          {values.url}
        </div>
      </div>
    </div>
  );
}

const heroFields = [
  eventFields.brand,
  eventFields.editionTag,
  eventFields.date,
  eventFields.venue,
  eventFields.pill,
  eventFields.url,
  eventFields.speaker1Image,
  eventFields.speaker1ImageCrop,
  eventFields.speaker1Name,
  eventFields.speaker1Role,
  eventFields.speaker1TalkTitle,
  eventFields.speaker2Image,
  eventFields.speaker2ImageCrop,
  eventFields.speaker2Name,
  eventFields.speaker2Role,
  eventFields.speaker2TalkTitle,
  eventFields.speaker3Image,
  eventFields.speaker3ImageCrop,
  eventFields.speaker3Name,
  eventFields.speaker3Role,
  eventFields.speaker3TalkTitle,
];

export const bannerSpeakers3Hero: GraphicTemplate = {
  id: "banner-speakers-3-hero",
  name: "Speakers ×3 Hero · 1080×1920",
  description:
    "Vertical 9:16 — date, venue and FREE pill dominate the hero, talks theme sits above as eyebrow, three speaker portraits below. Community wordmark is small.",
  aspect: "9:16",
  width: VARIANTS.story.width,
  height: VARIANTS.story.height,
  fields: heroFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeakers3Hero values={values} t={t} variant="story" />
  ),
};

export const bannerSpeakers3HeroSquare: GraphicTemplate = {
  id: "banner-speakers-3-hero-square",
  name: "Speakers ×3 Hero · 1080×1080",
  description:
    "Square 1:1 — same hero layout (date, venue, FREE pill) compressed for IG feed posts, with three speaker portraits below.",
  aspect: "1:1",
  width: VARIANTS.square.width,
  height: VARIANTS.square.height,
  fields: heroFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeakers3Hero values={values} t={t} variant="square" />
  ),
};

export const bannerSpeakers3HeroLandscape: GraphicTemplate = {
  id: "banner-speakers-3-hero-landscape",
  name: "Speakers ×3 Hero · 1024×600",
  description:
    "Landscape 1024×600 — accent panel left with date, venue and FREE pill; three speaker portraits with talk titles on the right.",
  aspect: "custom",
  width: VARIANTS.landscape.width,
  height: VARIANTS.landscape.height,
  fields: heroFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeakers3Hero values={values} t={t} variant="landscape" />
  ),
};
