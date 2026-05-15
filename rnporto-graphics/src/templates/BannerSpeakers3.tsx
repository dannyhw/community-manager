import { BannerHalftone } from "../system/Halftone";
import { MotifAtom } from "../system/MotifAtom";
import type { ThemeTokens } from "../system/tokens";
import { eventDefaults, eventFields } from "./_eventFields";
import type { GraphicTemplate, TemplateValues } from "./types";

const WIDTH = 1080;
const HEIGHT = 1920;
const PHOTO_WIDTH = 320;
const PHOTO_GAP = 20;

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
      {/* Photo flexes to consume all leftover vertical space — the row of
          three is width-capped at ~320px each, so height is where the
          images get to grow. */}
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
          rows={52}
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
      {/* Fixed-height caption so every photo above it gets the exact same
          height — a longer name/role that wraps to two lines must not
          steal height from that card's image. */}
      <div
        style={{
          marginTop: 24,
          height: 128,
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
            fontSize: 32,
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
            fontSize: 17,
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

function BannerSpeakers3({
  values,
  t,
}: {
  values: TemplateValues;
  t: ThemeTokens;
}) {
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
      <div
        style={{
          position: "relative",
          background: t.accent,
          color: t.accentInk,
          padding: "84px 80px 76px",
          overflow: "hidden",
          flex: "none",
        }}
      >
        <BannerHalftone
          color={t.accentInk}
          cols={60}
          rows={26}
          dot={1.4}
          direction="vertical"
          minOpacity={0.03}
          maxOpacity={0.22}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <MotifAtom color={t.accentInk} size={44} strokeWidth={1.4} />
          <span
            style={{
              fontFamily: t.fonts.mono,
              fontSize: 22,
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
            fontSize: 128,
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
            marginTop: 26,
            textWrap: "balance",
          }}
        >
          {values.brand}
        </div>

        <div
          style={{
            position: "relative",
            fontFamily: t.fonts.mono,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: 24,
            opacity: 0.92,
          }}
        >
          {values.editionTag}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: "72px 40px 76px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontFamily: t.fonts.mono,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.28em",
            color: t.fg.tertiary,
            textTransform: "uppercase",
          }}
        >
          Featuring
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            marginTop: 44,
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            gap: PHOTO_GAP,
          }}
        >
          <SpeakerCard
            src={values.speaker1Image}
            crop={values.speaker1ImageCrop}
            name={values.speaker1Name}
            role={values.speaker1Role}
            t={t}
          />
          <SpeakerCard
            src={values.speaker2Image}
            crop={values.speaker2ImageCrop}
            name={values.speaker2Name}
            role={values.speaker2Role}
            t={t}
          />
          <SpeakerCard
            src={values.speaker3Image}
            crop={values.speaker3ImageCrop}
            name={values.speaker3Name}
            role={values.speaker3Role}
            t={t}
          />
        </div>

        <div
          style={{
            marginTop: 56,
            flex: "none",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            paddingTop: 36,
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
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  color: t.fg.tertiary,
                  textTransform: "uppercase",
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontFamily: t.fonts.mono,
                  fontSize: 30,
                  fontWeight: 600,
                  color: t.fg.primary,
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
    </div>
  );
}

export const bannerSpeakers3: GraphicTemplate = {
  id: "banner-speakers-3",
  name: "Speakers ×3 · 1080×1920",
  description:
    "Vertical 9:16 story — meetup name and edition tag on top, three full-height speaker portraits with name and role below.",
  aspect: "9:16",
  width: WIDTH,
  height: HEIGHT,
  fields: [
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
  ],
  defaults: eventDefaults,
  Component: BannerSpeakers3,
};
