<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## What this package is

`rnporto-graphics` is a TanStack Start app that turns adjustable text templates into shareable PNG images for the React Native Porto meetup community. Pick a banner, tweak the text, switch mode/accent, click **Download PNG**.

The templates and the chrome both follow the **RN Porto · Atómico** design system (slate canvas, single accent, atom motif, sans/mono pairing). The system was authored in Claude Design and bundled at `https://api.anthropic.com/v1/design/h/mEbSjNzc4xQSRzHWDTBVhg`. The relevant source files live in `/tmp/design/react-native-porto/project/` while the bundle is unpacked — re-fetch and re-extract if you need to consult the originals (notably `tokens.jsx`, `motifs.jsx`, and `banner.jsx`).

The actual product surface is a single route (`/`) that hosts the studio. Other routes (`/about`, `/demo/tanstack-query`) are leftovers from the scaffold — keep them as scratch space until they earn a feature.

## Scaffold provenance

This package was scaffolded by the TanStack CLI in a scratch directory and copied into this monorepo. The exact command used:

```bash
npx @tanstack/cli@latest create my-tanstack-app --agent --add-ons tanstack-query
```

Follow-up commands run inside the scaffolded app:

```bash
npx @tanstack/intent@latest install   # injects the intent-skills block above
npx @tanstack/intent@latest list      # enumerates available skills (see below)
```

After scaffolding the app was renamed to `rnporto-graphics`, the npm `package-lock.json` was discarded, and the workspace was integrated into the existing pnpm monorepo (`pnpm-workspace.yaml`). Dependencies are managed with **pnpm 11** at the workspace root with `nodeLinker: hoisted`.

## Stack & integrations

- **TanStack Start** (file-based routing, SSR, server functions) — entry point in `vite.config.ts` via `tanstackStart()`.
- **TanStack Router** with auto code-splitting; routes live under `src/routes/`.
- **TanStack Query** (the `--add-ons tanstack-query` integration). Provider in `src/integrations/tanstack-query/root-provider.tsx`, devtools in `src/integrations/tanstack-query/devtools.tsx`.
- **TanStack Devtools** (router + query) wired up in `src/routes/__root.tsx`. Stripped from production via `@tanstack/devtools-vite`.
- **React 19** + **Vite 8** + **TypeScript 6**.
- **Tailwind CSS 4** (`@tailwindcss/vite` plugin). Design tokens in `src/styles.css`.
- **html-to-image** for client-side PNG export (the export button rasterises the canvas DOM node at full template resolution; `skipFonts: true` matches the Claude Design export config and avoids cross-origin font fetches).
- **prism-react-renderer** is in deps from an earlier code-snippet template that was retired when the RN Porto banners landed. Safe to remove when convenient.
- **lucide-react** comes from the scaffold; not currently used. Safe to remove if it stays unused.

## Intent skills available

Run `npx @tanstack/intent@latest list` from this package (or the workspace root) to print the live list. As of scaffolding, 9 packages with 30 skills are mapped, including the ones most likely to come up here:

- `@tanstack/router-core` — `router-core`, plus sub-skills for `data-loading`, `search-params`, `path-params`, `navigation`, `auth-and-guards`, `code-splitting`, `not-found-and-errors`, `ssr`, `type-safety`.
- `@tanstack/start-client-core` — `start-core` plus `server-functions`, `server-routes`, `middleware`, `execution-model`, `deployment`.
- `@tanstack/react-start` — `react-start`, plus `server-components` sub-skill (RSC).
- `@tanstack/router-plugin`, `@tanstack/virtual-file-routes`, `@tanstack/devtools*` for tooling.

Load a specific skill before changing routing/data-loading/SSR behaviour:

```bash
npx @tanstack/intent@latest load @tanstack/router-core#data-loading
```

## Project structure

```
rnporto-graphics/
├── src/
│   ├── routes/
│   │   ├── __root.tsx                 # document shell, theme bootstrap, devtools mount
│   │   ├── index.tsx                  # the studio (theme + template picker + editor + canvas + export)
│   │   ├── about.tsx                  # leftover scaffold page
│   │   └── demo/tanstack-query.tsx
│   ├── components/
│   │   ├── GraphicCanvas.tsx          # scaled preview wrapper; forwards a ref for export
│   │   ├── TemplateEditor.tsx         # field-driven form bound to template metadata
│   │   ├── TemplatePicker.tsx         # template chips
│   │   ├── ThemeControls.tsx          # mode toggle + 8 Porto accent presets + custom hex
│   │   └── Header.tsx, Footer.tsx, ThemeToggle.tsx
│   ├── system/                        # ← RN Porto · Atómico design system port
│   │   ├── tokens.ts                  # palette + type/space/radius/shadow + resolveTheme()
│   │   ├── MotifAtom.tsx              # 3-orbit React-style atom mark
│   │   └── Halftone.tsx               # accent-panel halftone backdrop
│   ├── templates/
│   │   ├── types.ts                   # GraphicTemplate now takes { values, t: ThemeTokens }
│   │   ├── index.ts                   # registry — add new banners here
│   │   ├── _eventFields.ts            # shared edition-banner field schema + barcode bars
│   │   ├── BannerWide.tsx             # 1200×630 OG / social
│   │   ├── BannerStory.tsx            # 540×960 IG/TikTok story
│   │   ├── BannerGlance.tsx           # 900×506 read-from-the-room
│   │   ├── BannerSimple.tsx           # 900×506 stripped to bones
│   │   ├── BannerTicket.tsx           # 900×506 perforated event pass (+ TicketAI variant)
│   │   ├── BannerTicketAISquare.tsx   # 720×720 square AI-edition ticket
│   │   └── BannerCommunity.tsx        # 900×506 group cover (devices + atom watermark)
│   ├── integrations/tanstack-query/
│   ├── router.tsx, styles.css
├── public/
├── vite.config.ts
└── tsconfig.json
```

## RN Porto · Atómico design system

Ported into `src/system/`. All banner templates and the studio chrome consume the same tokens.

- **Palette** — Atómico only (Ribeira was retired in the design chat). Light: `#F4F6F8` canvas / `#0E141B` ink / `#1F4FD6` accent. Dark: `#0A0E14` canvas / `#E7ECF2` ink / `#5E84F2` accent.
- **Accent presets** (8, in `RNP_ACCENT_PRESETS`): Cobalto, Douro, Gaia, Tile, Tinta, Tram, Pedra, Limão. Each is a Porto reference.
- **Auto-adapt** — `resolveTheme(mode, accentOverride)` lightens custom accents in dark mode (pushes lightness ≥ 0.6, caps saturation at 0.7) so user-picked colours stay legible against deep slate. Inverse text on accent flips to black/white based on perceived luminance.
- **Type pairing** — sans `"General Sans" / "Inter"` for body and headlines, mono `"JetBrains Mono"` for tags / metadata / numerals. Inter is loaded as a stand-in until General Sans is licensed.
- **Motif** — `MotifAtom` (3-orbit React-style atom). Used as the brand mark and as a watermark behind the giant edition number on most banners.
- **Backdrop** — `BannerHalftone` (grid of dots ramping along one axis) lives inside the accent panels of every event banner.

The chrome surfaces these via CSS variables (`--rnp-bg`, `--rnp-fg`, `--rnp-fg-soft`, `--rnp-line`, `--rnp-accent`, `--rnp-accent-ink`, …). The studio route mirrors the resolved accent into those variables in a `useEffect`, so changing the accent in `ThemeControls` reflows the whole UI without a re-render.

## Banner templates

All eight match what's in `react-native-porto/project/banner.jsx` from the Claude Design export. Each is parametrised so the labels (When/Doors/Where, Pass, Edition, Hosted at) stay fixed but the values are editable.

| ID | Size | Use |
|---|---|---|
| `banner-wide` | 1200×630 | OG image / social share — editorial body left, accent panel with edition mark right |
| `banner-glance` | 900×506 | Read-from-the-room poster — two-column lockup, no body copy |
| `banner-simple` | 900×506 | Stripped to three facts — accent slab left, headline + facts right |
| `banner-ticket` | 900×506 | Physical event pass with perforated tear-off stub, punch holes, real barcode |
| `banner-ticket-ai` | 900×506 | Same frame, headline reads "React Native / AI Native", no admit-one stamp |
| `banner-ticket-ai-square` | 720×720 | Square reinterpretation — body up top, perforated stub band along the bottom |
| `banner-story` | 540×960 | Vertical 9:16 — accent block on top, body and meta below |
| `banner-community` | 900×506 | Meetup group cover — wordmark + multi-platform device cluster, no event detail |

## Adding a new banner

1. Create `src/templates/MyBanner.tsx` exporting a `GraphicTemplate`. The component signature is `({ values, t }: { values: TemplateValues; t: ThemeTokens })`.
2. Pull values from the shared `eventFields` schema in `_eventFields.ts` so a new edition banner stays consistent with the rest. Use `buildBars()` if you need a barcode strip.
3. Define `width`/`height` at the actual export resolution (the preview auto-scales). Render with **inline styles**, not Tailwind classes — `html-to-image` needs every style to be inlined or already cascaded; sticking to inline styles avoids surprises with Tailwind v4's CSS layers under serialization.
4. Pick `aspect` from `'1:1' | '16:9' | '4:5' | '9:16' | '3:2' | 'custom'` (cosmetic — only used in the picker chip).
5. Register it in `src/templates/index.ts`.

The editor renders fields by `type` (`text`, `textarea`, `select`). Add new field types in `templates/types.ts` and `components/TemplateEditor.tsx` together.

## Scripts

```bash
pnpm --filter rnporto-graphics dev      # vite dev on :3000
pnpm --filter rnporto-graphics build    # client + ssr build
pnpm --filter rnporto-graphics preview  # serve the production build
pnpm --filter rnporto-graphics test     # vitest
```

## Environment variables

None required today. The studio is fully client-side after hydration. When server functions or external APIs land, follow the TanStack Start `execution-model` skill: prefix browser-readable vars with `VITE_`, keep secrets to `process.env` and gate them with `createServerFn` / `createServerOnlyFn`.

## Deployment notes

The build emits both `dist/client` and `dist/server` (TanStack Start). The default output assumes a Node-style runtime; consult `@tanstack/start-client-core#deployment` before targeting Cloudflare Workers, Vercel, Netlify, etc. — adapter selection happens in `vite.config.ts`. PNG export is **client-only**, so static-host or SPA-mode deploys are also viable.

## Key architectural decisions

- **Templates as data, not pages.** Each template is a `GraphicTemplate` object with field metadata + a render component. This keeps the editor generic (one editor, many templates) and lets future templates ship without touching the route.
- **Inline styles inside templates.** `html-to-image` rasterises the DOM, so we avoid runtime-only CSS features (Tailwind layers, custom properties from external stylesheets) inside the canvas itself. The chrome around the canvas (header, picker, editor) uses Tailwind freely.
- **Theme-driven, not class-driven.** Each banner component receives a resolved `ThemeTokens` object and reads `t.accent`, `t.fg.primary`, etc. directly. There is no `dark:` Tailwind variant inside templates — switching modes simply re-resolves the theme and re-renders.
- **Full-resolution rendering, scaled preview.** The canvas always renders at the template's true `width`/`height`; `GraphicCanvas` applies a CSS `transform: scale()` for fit. Export reads the original node, so PNG quality matches the declared dimensions.
- **Per-template state.** `valuesById` keeps edits when you switch templates so users don't lose work browsing options. Theme is global to the studio, not per-template — banners share an accent.
- **Shared event field schema.** All edition banners (Wide, Story, Glance, Simple, Ticket, TicketAI, TicketAISquare) declare a subset of `eventFields` from `_eventFields.ts`. Editing `titleLine1` on one banner is the same field key as on another, so the per-template state survives intent (changing template doesn't mean re-typing the same date).
- **Single-file routing.** TanStack Router auto-code-splitting is on by default — no manual `lazy` plumbing needed.

## Known gotchas

- **html-to-image + cross-origin fonts.** Inter and JetBrains Mono load from Google Fonts via `@import` in `styles.css`. The export passes `skipFonts: true` (matching the Claude Design config) to avoid CORS-blocked font fetches; the rasterised PNG still uses the right faces because the page already painted them. If you swap to a self-hosted font, you can drop `skipFonts` and pass `fontEmbedCSS` instead.
- **General Sans is a placeholder.** The design specifies General Sans; until it's licensed, the stack falls through to Inter (very close metrics). Drop in `@font-face` rules for General Sans when ready and remove the Google Fonts import.
- **Two competing theme switchers.** `components/ThemeToggle.tsx` (header) writes `data-theme` to `<html>` based on light/dark/auto preference. The studio route's own `useEffect` also writes `data-theme` from the in-page mode toggle. Right now the in-studio control wins because it runs after hydration; if you keep both, decide on a single source of truth.
- **TypeScript 6 + React 19 + Vite 8.** Bleeding-edge versions from the scaffold. If a dep starts complaining about peer ranges, check the TanStack release notes before pinning down.
- **`nodeLinker: hoisted`.** All deps live in the root `node_modules`; don't `cd` into the package and run `npm`/`yarn` — always go through pnpm at the workspace root or `pnpm --filter rnporto-graphics`.
- **Leftover scaffold routes.** `/about` and `/demo/tanstack-query` ship from the CTA template. Either repurpose them (about page, internal demo) or delete before public launch.
- **`prism-react-renderer` and `lucide-react` in deps but unused.** The first was for the retired code-snippet template, the second from the scaffold. Either use them or drop them from `package.json`.
- **`document.fonts` readiness.** Exporting immediately after first paint occasionally rasterises before custom fonts hydrate. If users report blocky exports, `await document.fonts.ready` before calling `toPng`.

## Next steps

- Decide: keep `/about` and the demo route, or strip them.
- Port the rest of the RN Porto design system surfaces (tokens swatches page, components showcase, app screens, landing page) — useful as living documentation, even if they're not consumed in the export flow.
- Add the **Bridge** and **Azulejo** community-cover variants from the design (the chat iterates on both; the final canvas keeps the azulejo tile panel).
- Add a "copy as URL" share flow (encode `valuesById[activeId]` + `mode` + `accent` into search params with `validateSearch` so a teammate can open the same draft).
- Persist drafts and theme choice to `localStorage`.
- Add bulk export (zip every banner with a shared brand block — useful for release-day kits, mirrors the `downloads-panel.jsx` from the Claude Design bundle).
- Wire a server function (`createServerFn`) for an optional headless render path (puppeteer / satori) if non-browser exports become necessary (e.g. CI-scheduled posts).
- Consolidate the two theme switchers into one (see gotchas).
