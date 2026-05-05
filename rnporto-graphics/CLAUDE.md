# CLAUDE.md — rnporto-graphics

This package implements designs from a **Claude Design handoff bundle**. Project structure, scripts, and stack live in [AGENTS.md](./AGENTS.md). This file covers how to work with the design source.

## When you're asked to add or change a banner/template

1. **Re-fetch the design bundle if it isn't already on disk.** It's a gzipped tarball wrapper:

   ```bash
   curl -sL "https://api.anthropic.com/v1/design/h/55YOJhrHkOyoRfF_7ear2A?open_file=RN+Porto+Design+System.html" -o /tmp/design.gz
   gunzip -f /tmp/design.gz   # produces /tmp/design/ with react-native-porto/ inside
   ```

   Source files land in `/tmp/design/react-native-porto/project/`. Most-referenced ones: `tokens.jsx`, `motifs.jsx`, `banner.jsx`, and the entry HTML `RN Porto Design System.html`.

2. **Read the chat transcripts first** (`react-native-porto/chats/chat1.md`). The transcripts show what the user actually wants and where they landed after iterating. The HTML is the output; the chat is where the intent lives. Don't skip them.

3. **Follow imports from the entry HTML top to bottom.** `RN Porto Design System.html` lists the script load order — open every file it pulls in (shared components, scripts) so you understand how the pieces fit before touching code here.

4. **If anything is ambiguous, ask before implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## How to translate the prototype

- **The design medium is HTML/CSS/JS — these are prototypes, not production code.** Recreate them pixel-perfectly in this repo's stack (React 19 + TanStack Start + inline styles inside templates). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.
- **Don't render the design files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.
- **Templates use inline styles, not Tailwind classes.** `html-to-image` rasterises the DOM, so anything that depends on runtime-only CSS (Tailwind v4 layers, external custom properties) inside the canvas is a foot-gun. The chrome around the canvas (header, picker, editor) uses Tailwind freely — see AGENTS.md for the split.
- **Templates consume resolved `ThemeTokens`, not CSS classes.** Read `t.accent`, `t.fg.primary`, etc. directly. There is no `dark:` Tailwind variant inside templates — switching modes simply re-resolves the theme.
- **Render at the template's true `width`/`height`.** The preview applies a CSS scale; export reads the original node, so PNG quality matches the declared dimensions.

## Design system facts that should not drift

These are settled decisions from the design chat — don't reintroduce them without checking with the user:

- **Atómico direction only.** Ribeira (warm/terracotta) was retired in the design chat. Keep the system single-direction; both `tokens.jsx` and the port at [src/system/tokens.ts](src/system/tokens.ts) reflect this.
- **Eight Porto-rooted accent presets**, exposed in `RNP_ACCENT_PRESETS`: Cobalto, Douro, Gaia, Tile, Tinta, Tram, Pedra, Limão. Custom hex is allowed alongside the presets.
- **Custom accents auto-adapt for dark mode** (lightness ≥ 0.6, saturation capped at 0.7). Inverse text on accent flips between black/white based on perceived luminance. Don't hand-pick `accentInk` — let `resolveTheme` compute it.
- **Type pairing**: sans (`"General Sans"` → falls back to `"Inter"`) for body and headlines; mono (`"JetBrains Mono"`) for tags, metadata, time, numerals. General Sans is a placeholder until licensed — keep the fallback in place.
- **The motif is `MotifAtom`** (3-orbit React-style atom) — used as the brand mark and as a watermark behind the giant edition number on most banners. Other motifs in the design (`MotifTram`, `MotifCoast`) belong to the retired Ribeira direction; don't pull them in without a conversation.
- **Banner accent panels use the halftone backdrop** (`Halftone.tsx`), a grid of dots ramping along one axis. Same accent, no new colors.

## Adding a new banner template

Workflow lives in AGENTS.md ("Adding a new banner"). Beyond that:

- Pull values from the shared `eventFields` schema in [_eventFields.ts](src/templates/_eventFields.ts) so a new edition banner stays consistent. Use `buildBars()` for barcode strips.
- Register the template in [src/templates/index.ts](src/templates/index.ts) — the studio picks it up automatically.

## Verification

PNG export is the product surface. After non-trivial template changes:

- `pnpm --filter rnporto-graphics dev` and visually confirm the template at full scale.
- Click **Download PNG** and inspect the rasterised output — that's what users ship. Watch for blocky text (font hadn't hydrated; `await document.fonts.ready` if you need to gate exports) and missing motifs.

Type-checks and tests don't exercise the canvas. If you can't open the studio to verify, say so explicitly rather than claiming success.
