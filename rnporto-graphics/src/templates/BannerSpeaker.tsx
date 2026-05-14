import { BannerHalftone } from "../system/Halftone";
import { MotifAtom } from "../system/MotifAtom";
import type { ThemeTokens } from "../system/tokens";
import { eventDefaults, eventFields } from "./_eventFields";
import type { GraphicTemplate, TemplateValues } from "./types";

type Variant = "square" | "portrait" | "landscape";

function SpeakerPhoto({
  src,
  crop,
  width,
  height,
  t,
}: {
  src: string;
  crop: string;
  width: number;
  height: number;
  t: ThemeTokens;
}) {
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        background: t.accent,
        color: t.accentInk,
        overflow: "hidden",
      }}
    >
      <BannerHalftone
        color={t.accentInk}
        cols={Math.round(width / 18)}
        rows={Math.round(height / 18)}
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
              size={Math.min(width, height) * 0.55}
              strokeWidth={1.2}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function BannerSpeaker({
  values,
  t,
  variant,
}: {
  values: TemplateValues;
  t: ThemeTokens;
  variant: Variant;
}) {
  const isLandscape = variant === "landscape";
  const isSquare = variant === "square";
  const isPortrait = variant === "portrait";
  // Landscape places photo and content side-by-side; the others stack them.
  const layout: "split" | "stacked" = isLandscape ? "split" : "stacked";

  let width: number;
  let height: number;
  let photoWidth: number;
  let photoHeight: number;
  let baseTitle: number;
  let nameSize: number;
  let contentPadding: string;

  if (isLandscape) {
    width = 1280;
    height = 720;
    photoWidth = 480;
    photoHeight = 720;
    baseTitle = 84;
    nameSize = 50;
    contentPadding = "52px 56px 52px 60px";
  } else if (isPortrait) {
    width = 1080;
    height = 1350;
    photoWidth = 1080;
    photoHeight = 640;
    baseTitle = 104;
    nameSize = 60;
    contentPadding = "40px 56px 44px";
  } else {
    width = 1080;
    height = 1080;
    photoWidth = 1080;
    photoHeight = 520;
    baseTitle = 88;
    nameSize = 52;
    contentPadding = "32px 48px 36px";
  }

  // Auto-shrink the talk title so long ones still fit. Titles up to ~32
  // chars stay at hero size and let `text-wrap: balance` handle any wrapping;
  // longer titles step down so 3-4 line layouts still leave a clear gap
  // between the title and the speaker + meta block.
  const titleChars = (values.talkTitle ?? "").length;
  const titleScale =
    titleChars > 70
      ? 0.58
      : titleChars > 50
        ? 0.78
        : titleChars > 42
          ? 0.86
          : titleChars > 32
            ? 0.94
            : 1;
  const titleSize = Math.round(baseTitle * titleScale);
  const titleLineHeight = titleScale < 1 ? 1 : 0.95;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        background: t.bg.canvas,
        color: t.fg.primary,
        fontFamily: t.fonts.sans,
        display: "flex",
        flexDirection: layout === "split" ? "row" : "column",
      }}
    >
      <div
        style={{
          position: "relative",
          width: photoWidth,
          height: photoHeight,
          flex: "none",
        }}
      >
        <SpeakerPhoto
          src={values.speakerImage}
          crop={values.speakerImageCrop}
          width={photoWidth}
          height={photoHeight}
          t={t}
        />

        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 44,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 22px",
            background: t.accent,
            color: t.accentInk,
            borderRadius: 999,
          }}
        >
          <MotifAtom color={t.accentInk} size={30} strokeWidth={1.6} />
          <span
            style={{
              fontFamily: t.fonts.mono,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {values.brand}
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 32,
            right: 44,
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: t.fonts.mono,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.16em",
              color: t.accentInk,
              background: "rgba(0,0,0,0.32)",
              padding: "8px 14px",
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            {values.editionTag}
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: contentPadding,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          boxSizing: "border-box",
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: t.fonts.mono,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: t.fg.tertiary,
              textTransform: "uppercase",
            }}
          >
            The talk
          </div>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: titleLineHeight,
              color: t.fg.primary,
              letterSpacing: "-0.035em",
              marginTop: 12,
              textWrap: "balance",
              whiteSpace: "pre-line",
            }}
          >
            {values.talkTitle}
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              fontFamily: t.fonts.mono,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: t.accent,
              textTransform: "uppercase",
            }}
          >
            The speaker
          </div>
          <div
            style={{
              fontSize: nameSize,
              fontWeight: 700,
              lineHeight: 1.02,
              color: t.accent,
              letterSpacing: "-0.025em",
              marginTop: 10,
            }}
          >
            {values.speakerName}
          </div>
          <div
            style={{
              fontFamily: t.fonts.mono,
              fontSize: 22,
              fontWeight: 500,
              color: t.fg.secondary,
              marginTop: 8,
              letterSpacing: "0.02em",
            }}
          >
            {values.speakerRole}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            paddingTop: 24,
            borderTop: `1px solid ${t.line.divider}`,
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
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  color: t.fg.tertiary,
                  textTransform: "uppercase",
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontFamily: t.fonts.mono,
                  fontSize: 26,
                  fontWeight: 600,
                  color: t.fg.primary,
                  marginTop: 6,
                  letterSpacing: "-0.01em",
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const speakerFields = [
  eventFields.speakerImage,
  eventFields.speakerImageCrop,
  eventFields.speakerName,
  eventFields.speakerRole,
  eventFields.talkTitle,
  eventFields.editionTag,
  eventFields.brand,
  eventFields.date,
  eventFields.venue,
];

export const bannerSpeakerSquare: GraphicTemplate = {
  id: "banner-speaker-square",
  name: "Speaker · 1080×1080",
  description:
    "Square speaker spotlight for IG feed — photo on top, talk title and speaker below, minimal event meta.",
  aspect: "1:1",
  width: 1080,
  height: 1080,
  fields: speakerFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeaker values={values} t={t} variant="square" />
  ),
};

export const bannerSpeakerPortrait: GraphicTemplate = {
  id: "banner-speaker-portrait",
  name: "Speaker · 1080×1350",
  description:
    "4:5 portrait speaker spotlight for IG feed — taller photo, more breathing room around the talk title.",
  aspect: "4:5",
  width: 1080,
  height: 1350,
  fields: speakerFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeaker values={values} t={t} variant="portrait" />
  ),
};

export const bannerSpeakerLandscape: GraphicTemplate = {
  id: "banner-speaker-landscape",
  name: "Speaker · 1280×720",
  description:
    "16:9 landscape speaker spotlight — photo column on the left, talk + speaker meta on the right. Good for slides and OG.",
  aspect: "16:9",
  width: 1280,
  height: 720,
  fields: speakerFields,
  defaults: eventDefaults,
  Component: ({ values, t }) => (
    <BannerSpeaker values={values} t={t} variant="landscape" />
  ),
};
