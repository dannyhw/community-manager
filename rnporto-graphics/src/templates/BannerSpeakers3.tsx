import { BannerHalftone } from "../system/Halftone";
import { MotifAtom } from "../system/MotifAtom";
import type { ThemeTokens } from "../system/tokens";
import { eventDefaults, eventFields } from "./_eventFields";
import type { GraphicTemplate, TemplateValues } from "./types";

type Variant = "story" | "square" | "landscape";

interface VariantConfig {
  width: number;
  height: number;
  // "stacked" — accent header on top, photos below (story / square).
  // "split" — accent panel on the left, photos on the right (landscape).
  layout: "stacked" | "split";
  leftPanelWidth: number;
  headerPadding: string;
  headerHalftone: { cols: number; rows: number };
  motifSize: number;
  eyebrowSize: number;
  brandSize: number;
  editionSize: number;
  bodyPadding: string;
  featuringSize: number;
  featuringGap: number;
  photoWidth: number;
  photoGap: number;
  captionMarginTop: number;
  captionHeight: number;
  nameSize: number;
  roleSize: number;
  metaMarginTop: number;
  metaPaddingTop: number;
  metaColumns: 1 | 2;
  metaColGap: number;
  metaLabelSize: number;
  metaValueSize: number;
}

const VARIANTS: Record<Variant, VariantConfig> = {
  story: {
    width: 1080,
    height: 1920,
    layout: "stacked",
    leftPanelWidth: 0,
    headerPadding: "84px 80px 76px",
    headerHalftone: { cols: 60, rows: 26 },
    motifSize: 44,
    eyebrowSize: 22,
    brandSize: 128,
    editionSize: 24,
    bodyPadding: "72px 40px 76px",
    featuringSize: 22,
    featuringGap: 44,
    photoWidth: 320,
    photoGap: 20,
    captionMarginTop: 24,
    captionHeight: 128,
    nameSize: 32,
    roleSize: 17,
    metaMarginTop: 56,
    metaPaddingTop: 36,
    metaColumns: 2,
    metaColGap: 32,
    metaLabelSize: 16,
    metaValueSize: 30,
  },
  square: {
    width: 1080,
    height: 1080,
    layout: "stacked",
    leftPanelWidth: 0,
    headerPadding: "56px 60px 50px",
    headerHalftone: { cols: 60, rows: 14 },
    motifSize: 34,
    eyebrowSize: 18,
    brandSize: 78,
    editionSize: 18,
    bodyPadding: "44px 40px 46px",
    featuringSize: 18,
    featuringGap: 28,
    photoWidth: 320,
    photoGap: 20,
    captionMarginTop: 18,
    captionHeight: 104,
    nameSize: 26,
    roleSize: 14,
    metaMarginTop: 32,
    metaPaddingTop: 24,
    metaColumns: 2,
    metaColGap: 24,
    metaLabelSize: 13,
    metaValueSize: 22,
  },
  landscape: {
    width: 1920,
    height: 1080,
    layout: "split",
    leftPanelWidth: 660,
    headerPadding: "76px 60px",
    headerHalftone: { cols: 36, rows: 64 },
    motifSize: 38,
    eyebrowSize: 20,
    brandSize: 140,
    editionSize: 20,
    bodyPadding: "76px 64px",
    featuringSize: 20,
    featuringGap: 40,
    photoWidth: 360,
    photoGap: 26,
    captionMarginTop: 22,
    captionHeight: 120,
    nameSize: 30,
    roleSize: 16,
    metaMarginTop: 0,
    metaPaddingTop: 28,
    metaColumns: 1,
    metaColGap: 22,
    metaLabelSize: 15,
    metaValueSize: 26,
  },
};

function HeaderContent({
  values,
  t,
  cfg,
}: {
  values: TemplateValues;
  t: ThemeTokens;
  cfg: VariantConfig;
}) {
  return (
    <>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: Math.round(cfg.eyebrowSize * 0.8),
        }}
      >
        <MotifAtom color={t.accentInk} size={cfg.motifSize} strokeWidth={1.4} />
        <span
          style={{
            fontFamily: t.fonts.mono,
            fontSize: cfg.eyebrowSize,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Speakers
        </span>
      </div>

      <div
        style={{
          position: "relative",
          fontSize: cfg.brandSize,
          fontWeight: 700,
          lineHeight: 0.92,
          letterSpacing: "-0.045em",
          marginTop: Math.round(cfg.brandSize * 0.2),
          textWrap: "balance",
        }}
      >
        {values.brand}
      </div>

      <div
        style={{
          position: "relative",
          fontFamily: t.fonts.mono,
          fontSize: cfg.editionSize,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginTop: cfg.editionSize,
          opacity: 0.92,
        }}
      >
        {values.editionTag}
      </div>
    </>
  );
}

function MetaGrid({
  values,
  t,
  cfg,
  onAccent = false,
  marginTop,
}: {
  values: TemplateValues;
  t: ThemeTokens;
  cfg: VariantConfig;
  onAccent?: boolean;
  marginTop: number | string;
}) {
  return (
    <div style={{ marginTop, flex: "none", position: "relative" }}>
      <div
        style={{
          height: 1,
          background: onAccent ? t.accentInk : t.line.divider,
          opacity: onAccent ? 0.28 : 1,
        }}
      />
      <div
        style={{
          marginTop: cfg.metaPaddingTop,
          display: "grid",
          gridTemplateColumns: cfg.metaColumns === 1 ? "1fr" : "1fr 1fr",
          gap: cfg.metaColGap,
        }}
      >
        {[
          { k: "When", v: values.date },
          { k: "Where", v: values.venue },
        ].map(({ k, v }) => (
          <div key={k}>
            <div
              style={{
                fontFamily: t.fonts.mono,
                fontSize: cfg.metaLabelSize,
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: onAccent ? t.accentInk : t.fg.tertiary,
                textTransform: "uppercase",
                opacity: onAccent ? 0.72 : 1,
              }}
            >
              {k}
            </div>
            <div
              style={{
                fontFamily: t.fonts.mono,
                fontSize: cfg.metaValueSize,
                fontWeight: 600,
                color: onAccent ? t.accentInk : t.fg.primary,
                marginTop: 8,
                letterSpacing: "-0.01em",
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeakerCard({
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
        display: "flex",
        flexDirection: "column",
        width: cfg.photoWidth,
        flex: "none",
        minHeight: 0,
      }}
    >
      {/* Photo flexes to consume all leftover vertical space — the row of
          three is width-capped, so height is where the images get to grow. */}
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          borderRadius: 28,
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
      </div>
      {/* Fixed-height caption so every photo above it gets the exact same
          height — a longer name/role that wraps to two lines must not
          steal height from that card's image. */}
      <div
        style={{
          marginTop: cfg.captionMarginTop,
          height: cfg.captionHeight,
          flex: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: cfg.nameSize,
            fontWeight: 700,
            lineHeight: 1.05,
            color: t.fg.primary,
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
            color: t.fg.secondary,
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

function PhotoRow({
  values,
  t,
  cfg,
}: {
  values: TemplateValues;
  t: ThemeTokens;
  cfg: VariantConfig;
}) {
  const speakers = [1, 2, 3].map((i) => ({
    src: values[`speaker${i}Image`],
    crop: values[`speaker${i}ImageCrop`],
    name: values[`speaker${i}Name`],
    role: values[`speaker${i}Role`],
  }));
  return (
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
  );
}

function Featuring({ t, cfg }: { t: ThemeTokens; cfg: VariantConfig }) {
  return (
    <div
      style={{
        flex: "none",
        fontFamily: t.fonts.mono,
        fontSize: cfg.featuringSize,
        fontWeight: 600,
        letterSpacing: "0.28em",
        color: t.fg.tertiary,
        textTransform: "uppercase",
      }}
    >
      Featuring
    </div>
  );
}

function BannerSpeakers3({
  values,
  t,
  variant,
}: {
  values: TemplateValues;
  t: ThemeTokens;
  variant: Variant;
}) {
  const cfg = VARIANTS[variant];

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
        <div
          style={{
            position: "relative",
            width: cfg.leftPanelWidth,
            height: "100%",
            flex: "none",
            background: t.accent,
            color: t.accentInk,
            padding: cfg.headerPadding,
            boxSizing: "border-box",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <BannerHalftone
            color={t.accentInk}
            cols={cfg.headerHalftone.cols}
            rows={cfg.headerHalftone.rows}
            dot={1.4}
            direction="vertical"
            minOpacity={0.03}
            maxOpacity={0.2}
          />
          <HeaderContent values={values} t={t} cfg={cfg} />
          <MetaGrid
            values={values}
            t={t}
            cfg={cfg}
            onAccent
            marginTop="auto"
          />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: cfg.bodyPadding,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Featuring t={t} cfg={cfg} />
          <PhotoRow values={values} t={t} cfg={cfg} />
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
      <div
        style={{
          position: "relative",
          background: t.accent,
          color: t.accentInk,
          padding: cfg.headerPadding,
          overflow: "hidden",
          flex: "none",
        }}
      >
        <BannerHalftone
          color={t.accentInk}
          cols={cfg.headerHalftone.cols}
          rows={cfg.headerHalftone.rows}
          dot={1.4}
          direction="vertical"
          minOpacity={0.03}
          maxOpacity={0.22}
        />
        <HeaderContent values={values} t={t} cfg={cfg} />
      </div>

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
        <Featuring t={t} cfg={cfg} />
        <PhotoRow values={values} t={t} cfg={cfg} />
        <MetaGrid values={values} t={t} cfg={cfg} marginTop={cfg.metaMarginTop} />
      </div>
    </div>
  );
}

const speakerFields = [
  eventFields.brand,
  eventFields.editionTag,
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
  eventFields.date,
  eventFields.venue,
];

export const bannerSpeakers3: GraphicTemplate = {
  id: "banner-speakers-3",
  name: "Speakers ×3 · 1080×1920",
  description:
    "Vertical 9:16 story — meetup name and edition tag on top, three full-height speaker portraits with name and role below.",
  aspect: "9:16",
  width: VARIANTS.story.width,
  height: VARIANTS.story.height,
  fields: speakerFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeakers3 values={values} t={t} variant="story" />
  ),
};

export const bannerSpeakers3Square: GraphicTemplate = {
  id: "banner-speakers-3-square",
  name: "Speakers ×3 · 1080×1080",
  description:
    "Square 1:1 — meetup name and edition tag on top, three speaker portraits with name and role. For IG feed and platforms without a 9:16 slot.",
  aspect: "1:1",
  width: VARIANTS.square.width,
  height: VARIANTS.square.height,
  fields: speakerFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeakers3 values={values} t={t} variant="square" />
  ),
};

export const bannerSpeakers3Landscape: GraphicTemplate = {
  id: "banner-speakers-3-landscape",
  name: "Speakers ×3 · 1920×1080",
  description:
    "Landscape 16:9 — accent panel with meetup name, edition tag and meta on the left, three speaker portraits on the right. For slides, OG and YouTube.",
  aspect: "16:9",
  width: VARIANTS.landscape.width,
  height: VARIANTS.landscape.height,
  fields: speakerFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeakers3 values={values} t={t} variant="landscape" />
  ),
};
