import { BannerHalftone } from "../system/Halftone";
import { MotifAtom } from "../system/MotifAtom";
import type { ThemeTokens } from "../system/tokens";
import { eventDefaults, eventFields } from "./_eventFields";
import type { GraphicTemplate, TemplateValues } from "./types";

const WIDTH = 1080;
const HEIGHT = 1920;
const HERO_HEIGHT = 580;
const FOOTER_HEIGHT = 88;
const PHOTO_WIDTH = 320;
const PHOTO_GAP = 18;
const CAPTION_HEIGHT = 110;

function SpeakerCard({
  src,
  crop,
  name,
  role,
  talkTitle,
  t,
}: {
  src: string;
  crop: string;
  name: string;
  role: string;
  talkTitle: string;
  t: ThemeTokens;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: PHOTO_WIDTH,
        flex: "none",
        minHeight: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          borderRadius: 26,
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
                size={PHOTO_WIDTH * 0.55}
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
            height: 260,
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
            padding: "0 18px 22px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: 26,
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
              fontSize: 15,
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
          marginTop: 18,
          height: CAPTION_HEIGHT,
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
            fontSize: 22,
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

function BannerSpeakers3Hero({
  values,
  t,
}: {
  values: TemplateValues;
  t: ThemeTokens;
}) {
  const speakers = [1, 2, 3].map((i) => ({
    src: values[`speaker${i}Image`],
    crop: values[`speaker${i}ImageCrop`],
    name: values[`speaker${i}Name`],
    role: values[`speaker${i}Role`],
    talkTitle: values[`speaker${i}TalkTitle`],
  }));

  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
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
          height: HERO_HEIGHT,
          background: t.accent,
          color: t.accentInk,
          padding: "56px 60px 60px",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: "none",
        }}
      >
        <BannerHalftone
          color={t.accentInk}
          cols={60}
          rows={50}
          dot={1.4}
          direction="vertical"
          minOpacity={0.03}
          maxOpacity={0.2}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flex: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MotifAtom color={t.accentInk} size={36} strokeWidth={1.5} />
            <span
              style={{
                fontFamily: t.fonts.mono,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              {values.brand}
            </span>
          </div>
          <span
            style={{
              fontFamily: t.fonts.mono,
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.94,
              padding: "10px 20px",
              border: `1.5px solid ${t.accentInk}`,
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            {values.editionTag}
          </span>
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 56,
            fontSize: 130,
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
            textWrap: "balance",
            flex: "none",
          }}
        >
          {values.date}
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 20,
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 0.96,
            letterSpacing: "-0.035em",
            textWrap: "balance",
            flex: "none",
          }}
        >
          {values.venue}
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 28,
            display: "flex",
            flex: "none",
          }}
        >
          <div
            style={{
              fontFamily: t.fonts.mono,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "14px 24px",
              background: t.accentInk,
              color: t.accent,
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            {values.pill}
          </div>
        </div>
      </div>

      {/* Body — three speakers */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: "48px 60px 24px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontFamily: t.fonts.mono,
            fontSize: 20,
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
            marginTop: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            gap: PHOTO_GAP,
          }}
        >
          {speakers.map((s, i) => (
            <SpeakerCard key={i} {...s} t={t} />
          ))}
        </div>
      </div>

      {/* Footer — meetup URL, subtle */}
      <div
        style={{
          height: FOOTER_HEIGHT,
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
            fontSize: 22,
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

export const bannerSpeakers3Hero: GraphicTemplate = {
  id: "banner-speakers-3-hero",
  name: "Speakers ×3 Hero · 1080×1920",
  description:
    "Vertical 9:16 — date, venue and FREE pill dominate the hero, talks theme sits above as eyebrow, three speaker portraits below. Community wordmark is small.",
  aspect: "9:16",
  width: WIDTH,
  height: HEIGHT,
  fields: [
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
  ],
  defaults: eventDefaults,
  Component: BannerSpeakers3Hero,
};
