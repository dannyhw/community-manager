import { BannerHalftone } from "../system/Halftone";
import { MotifAtom } from "../system/MotifAtom";
import type { ThemeTokens } from "../system/tokens";
import { eventDefaults, eventFields } from "./_eventFields";
import type { GraphicTemplate, TemplateValues } from "./types";

const WIDTH = 1080;
const HEIGHT = 1920;
const HERO_HEIGHT = 720;
const FOOTER_HEIGHT = 88;
const PHOTO_WIDTH = 320;
const PHOTO_GAP = 18;
const CAPTION_HEIGHT = 124;

function SpeakerCard({
  src,
  crop,
  name,
  role,
  t,
}: {
  src: string;
  crop: string;
  name: string;
  role: string;
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
      </div>
      <div
        style={{
          marginTop: 20,
          height: CAPTION_HEIGHT,
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
            fontSize: 30,
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
            fontSize: 16,
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

        {/* Small brand strip — community is present, not loud */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flex: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <MotifAtom color={t.accentInk} size={30} strokeWidth={1.4} />
            <span
              style={{
                fontFamily: t.fonts.mono,
                fontSize: 18,
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
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.92,
              padding: "8px 16px",
              border: `1.5px solid ${t.accentInk}`,
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            {values.editionTag}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Theme — what the talks are about, sits above the date */}
        <div
          style={{
            position: "relative",
            fontFamily: t.fonts.mono,
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            opacity: 0.92,
            marginBottom: 18,
            flex: "none",
          }}
        >
          {values.talksTheme}
        </div>

        {/* DATE — hero */}
        <div
          style={{
            position: "relative",
            fontSize: 188,
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: "-0.055em",
            textWrap: "balance",
            flex: "none",
          }}
        >
          {values.date}
        </div>

        {/* Venue + FREE pill */}
        <div
          style={{
            position: "relative",
            marginTop: 28,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            flex: "none",
          }}
        >
          <div
            style={{
              fontSize: 50,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              flex: 1,
              minWidth: 0,
              textWrap: "balance",
            }}
          >
            {values.venue}
          </div>
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
              flex: "none",
              alignSelf: "flex-end",
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
    eventFields.talksTheme,
    eventFields.date,
    eventFields.venue,
    eventFields.pill,
    eventFields.url,
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
  ],
  defaults: eventDefaults,
  Component: BannerSpeakers3Hero,
};
