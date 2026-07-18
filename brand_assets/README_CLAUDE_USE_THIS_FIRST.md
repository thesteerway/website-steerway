# The Steerway — Sanitized Brand Assets for the New Website Plan

This folder is intentionally small. Use **only** these files for the new The Steerway website redesign.
Do not search the old flooded asset folder. Do not use old/extra logo variants, ceremonial lockups, letterhead lockups, unused wordmarks, or alternate typography assets.

## Absolute rules for Claude / developer / designer

1. **Primary website identity:** use `01_primary_logo/steerway_primary_s_path_mark__USE_FOR_LOADER_LOGO_PORTAL__on_dark.svg` for the loader, logo-as-portal, S-path journey, and brand mark.
2. **Header logo:** use `01_primary_logo/steerway_primary_header_lockup__USE_FOR_HEADER_ON_DARK.svg` for the header/navigation on dark backgrounds.
3. **Secondary needle:** use `02_secondary_needle/steerway_secondary_needle__USE_FOR_INTERNAL_PAGE_MAPPING_ONLY.svg` only as the internal-page mapping/navigation motif. Do **not** replace the primary logo with the needle.
4. **Footer payoff:** use `03_footer_wordmark/steerway_footer_utility_wordmark_period__USE_FOR_FINAL_FOOTER_PAYOFF.svg` for the final footer `STEERWAY.` payoff. The champagne square/dot motion should resolve into the final period.
5. **Favicons/app icons:** use only the files in `04_favicon_and_icons` for browser/app icons.
6. Do **not** use any logo/wordmark not present in this sanitized folder.
7. Do **not** use old Blank Group, Grid & Frame, Shor Strategy, Steer Intelligence, ceremonial, letterhead, or unrelated brand assets.
8. Do **not** use font files. Fonts must be loaded through CSS/Google Fonts or the web stack.

## Brand colors

Use these as the website color tokens:

```css
:root {
  --obsidian: #0A0A0C;
  --graphite: #131316;
  --graphite-2: #17171B;
  --ivory: #ECE7DD;
  --ivory-dim: #C9C4BB;
  --mist: #837F77;
  --mist-2: #565149;
  --champagne: #C3A268;
  --bronze: #96762F;
  --line: rgba(236, 231, 221, 0.09);
}
```

## Typography rules

No font files are included in this ZIP. Use CSS/web fonts.

Recommended:
- **Fraunces** — large editorial headlines, premium display moments, hero copy.
- **IBM Plex Mono** — utility labels, coordinates, technical metadata, footer `STEERWAY.` payoff.
- **Inter** — body copy, navigation, UI text, descriptions.

Do not randomly use other fonts. Do not switch to generic SaaS typography unless explicitly requested.

## Asset usage map

| Website area | Use this asset |
|---|---|
| Loader / intro mark | `steerway_primary_s_path_mark__USE_FOR_LOADER_LOGO_PORTAL__on_dark.svg` |
| Logo-as-portal / S-path journey | `steerway_primary_s_path_mark__USE_FOR_LOADER_LOGO_PORTAL__on_dark.svg` |
| Header/nav | `steerway_primary_header_lockup__USE_FOR_HEADER_ON_DARK.svg` |
| Optional centered brand moment | `steerway_primary_stacked_lockup__OPTIONAL_CENTERED_ONLY.svg` |
| Internal page mapping motif | `steerway_secondary_needle__USE_FOR_INTERNAL_PAGE_MAPPING_ONLY.svg` |
| Subtle internal-page needle | `steerway_secondary_needle_mono__USE_FOR_SUBTLE_ON_DARK_ONLY.svg` |
| Footer final payoff | `steerway_footer_utility_wordmark_period__USE_FOR_FINAL_FOOTER_PAYOFF.svg` |
| Browser/app icons | `04_favicon_and_icons/*` |

## Motion meaning

The primary logo is the entrance and the world.
The S-path/negative space inside the primary mark is the route.
The champagne square/dot is the moving traveler.
The secondary needle is for internal-page mapping, not for the main landing-page logo portal.
The footer wordmark is the final resolution, where the champagne square/dot becomes the period in `STEERWAY.`

## What not to do

- Do not use the needle as the primary website logo.
- Do not use the stacked/ceremonial mark as the default header logo.
- Do not use random wordmarks from the old folder.
- Do not use multiple competing logo styles in the same build.
- Do not reinterpret the logo or redraw it unless explicitly instructed.
- Do not rasterize the primary logo for the zoom portal. Use SVG/vector so it stays sharp while scaling.