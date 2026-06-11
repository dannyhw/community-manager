import { BannerHalftone } from "../system/Halftone";
import { MotifAtom } from "../system/MotifAtom";
import type { ThemeTokens } from "../system/tokens";
import { eventDefaults, eventFields } from "./_eventFields";
import type { GraphicTemplate, TemplateValues } from "./types";

type Variant = "story" | "square" | "landscape";

interface VariantConfig {
  width: number;
  height: number;
  // Gap between the three photo columns — the canvas background shows
  // through, which is what makes the full-bleed image read as a triptych.
  panelGap: number;
  edgeInset: number;
  topScrimHeight: number;
  pillHeight: number;
  pillFontSize: number;
  motifSize: number;
  brandSize: number;
  brandMarginTop: number;
  dateSize: number;
  dateMarginTop: number;
  venueSize: number;
  venueMarginTop: number;
  captionScrimHeight: number;
  captionPadding: string;
  nameSize: number;
  roleSize: number;
}

const VARIANTS: Record<Variant, VariantConfig> = {
  story: {
    width: 1080,
    height: 1920,
    panelGap: 6,
    edgeInset: 64,
    topScrimHeight: 720,
    pillHeight: 56,
    pillFontSize: 21,
    motifSize: 28,
    brandSize: 118,
    brandMarginTop: 40,
    dateSize: 48,
    dateMarginTop: 30,
    venueSize: 26,
    venueMarginTop: 14,
    captionScrimHeight: 360,
    captionPadding: "0 20px 48px",
    nameSize: 32,
    roleSize: 17,
  },
  square: {
    width: 1080,
    height: 1080,
    panelGap: 6,
    edgeInset: 56,
    topScrimHeight: 560,
    pillHeight: 48,
    pillFontSize: 18,
    motifSize: 24,
    brandSize: 92,
    brandMarginTop: 30,
    dateSize: 38,
    dateMarginTop: 22,
    venueSize: 21,
    venueMarginTop: 12,
    captionScrimHeight: 280,
    captionPadding: "0 18px 36px",
    nameSize: 28,
    roleSize: 15,
  },
  landscape: {
    width: 1920,
    height: 1080,
    panelGap: 8,
    edgeInset: 72,
    topScrimHeight: 540,
    pillHeight: 52,
    pillFontSize: 20,
    motifSize: 26,
    brandSize: 128,
    brandMarginTop: 34,
    dateSize: 46,
    dateMarginTop: 24,
    venueSize: 24,
    venueMarginTop: 12,
    captionScrimHeight: 300,
    captionPadding: "0 28px 44px",
    nameSize: 34,
    roleSize: 18,
  },
};

function SpeakerPanel({
  src,
  crop,
  name,
  role,
  t,
  cfg,
}: {
  src: string;
  crop: string;
  name: string;
  role: string;
  t: ThemeTokens;
  cfg: VariantConfig;
}) {
  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        minWidth: 0,
        height: "100%",
        overflow: "hidden",
        background: t.accent,
        color: t.accentInk,
      }}
    >
      <BannerHalftone
        color={t.accentInk}
        cols={22}
        rows={Math.round(cfg.height / 24)}
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
              size={Math.round((cfg.width / 3) * 0.55)}
              strokeWidth={1.2}
            />
          </div>
        </div>
      )}

      {/* Per-panel scrim keeps each caption readable regardless of how
          bright that speaker's photo is at the bottom. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: cfg.captionScrimHeight,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.72) 42%, rgba(0,0,0,0.3) 76%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: cfg.captionPadding,
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
            marginTop: 10,
            letterSpacing: "0.02em",
            lineHeight: 1.3,
            textWrap: "balance",
          }}
        >
          {role}
        </div>
      </div>
    </div>
  );
}

function BannerSpeakers3Triptych({
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
  }));

  return (
    <div
      style={{
        width: cfg.width,
        height: cfg.height,
        position: "relative",
        overflow: "hidden",
        background: t.bg.canvas,
        color: "#fff",
        fontFamily: t.fonts.sans,
      }}
    >
      {/* Full-bleed photo layer — three columns split the whole canvas. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          gap: cfg.panelGap,
        }}
      >
        {speakers.map((s, i) => (
          <SpeakerPanel key={i} {...s} t={t} cfg={cfg} />
        ))}
      </div>

      {/* Top scrim spans all three panels so the meetup name + date block
          reads as one headline across the triptych. All text is white —
          the dark scrim guarantees contrast across accents and photos;
          brand colour comes through the accent chip. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: cfg.topScrimHeight,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.74) 42%, rgba(0,0,0,0.34) 76%, rgba(0,0,0,0) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: cfg.edgeInset,
          left: cfg.edgeInset,
          right: cfg.edgeInset,
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 13,
            height: cfg.pillHeight,
            padding: `0 ${Math.round(cfg.pillHeight * 0.42)}px`,
            background: t.accent,
            color: t.accentInk,
            borderRadius: 999,
            boxSizing: "border-box",
          }}
        >
          <MotifAtom color={t.accentInk} size={cfg.motifSize} strokeWidth={1.6} />
          <span
            style={{
              fontFamily: t.fonts.mono,
              fontSize: cfg.pillFontSize,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {values.editionTag}
          </span>
        </div>

        <div
          style={{
            fontSize: cfg.brandSize,
            fontWeight: 700,
            lineHeight: 0.94,
            letterSpacing: "-0.04em",
            color: "#fff",
            marginTop: cfg.brandMarginTop,
            textWrap: "balance",
          }}
        >
          {values.brand}
        </div>

        <div
          style={{
            fontFamily: t.fonts.mono,
            fontSize: cfg.dateSize,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#fff",
            marginTop: cfg.dateMarginTop,
          }}
        >
          {values.date}
        </div>

        {values.venue ? (
          <div
            style={{
              fontFamily: t.fonts.mono,
              fontSize: cfg.venueSize,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.82)",
              marginTop: cfg.venueMarginTop,
            }}
          >
            {values.venue}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const triptychFields = [
  eventFields.brand,
  eventFields.editionTag,
  eventFields.date,
  eventFields.venue,
  eventFields.speaker1Image,
  eventFields.speaker1ImageCrop,
  eventFields.speaker1Name,
  eventFields.speaker1Role,
  eventFields.speaker2Image,
  eventFields.speaker2ImageCrop,
  eventFields.speaker2Name,
  eventFields.speaker2Role,
  eventFields.speaker3Image,
  eventFields.speaker3ImageCrop,
  eventFields.speaker3Name,
  eventFields.speaker3Role,
];

export const bannerSpeakers3Triptych: GraphicTemplate = {
  id: "banner-speakers-3-triptych",
  name: "Speakers ×3 Triptych · 1080×1920",
  description:
    "Vertical 9:16 — three full-height speaker photos split the canvas, meetup name and date overlaid big on a top scrim, speaker name and company at the foot of each panel.",
  aspect: "9:16",
  width: VARIANTS.story.width,
  height: VARIANTS.story.height,
  fields: triptychFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeakers3Triptych values={values} t={t} variant="story" />
  ),
};

export const bannerSpeakers3TriptychSquare: GraphicTemplate = {
  id: "banner-speakers-3-triptych-square",
  name: "Speakers ×3 Triptych · 1080×1080",
  description:
    "Square 1:1 — full-bleed triptych of three speaker photos with meetup name and date overlaid on top, speaker captions per panel. For IG feed.",
  aspect: "1:1",
  width: VARIANTS.square.width,
  height: VARIANTS.square.height,
  fields: triptychFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeakers3Triptych values={values} t={t} variant="square" />
  ),
};

export const bannerSpeakers3TriptychLandscape: GraphicTemplate = {
  id: "banner-speakers-3-triptych-landscape",
  name: "Speakers ×3 Triptych · 1920×1080",
  description:
    "Landscape 16:9 — full-bleed triptych of three speaker photos, meetup name and date spanning the top, speaker name and company per panel. For slides, OG and YouTube.",
  aspect: "16:9",
  width: VARIANTS.landscape.width,
  height: VARIANTS.landscape.height,
  fields: triptychFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeakers3Triptych values={values} t={t} variant="landscape" />
  ),
};
