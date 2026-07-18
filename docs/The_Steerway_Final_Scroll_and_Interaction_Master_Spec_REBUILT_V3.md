---
title: "The Steerway Final Scroll and Interaction Master Spec - Rebuilt V3"
subtitle: "Corrected hero contract, uploaded HTML field-background integration, full scroll/motion specification"
date: "July 2026"
geometry: margin=0.62in
fontsize: 10pt
mainfont: DejaVu Sans
monofont: DejaVu Sans Mono
toc: true
toc-depth: 3
---


![Spec cover](steerway_v3_final_assets/01_homepage_architecture_v3.png){width=100%}

\newpage

# 0. V3 implementation contract

This V3 rebuild corrects a major issue in the previous documents: the hero section was over-specified. The user explicitly said the hero section would be designed later.

Therefore, the hero section is now a **controlled placeholder system**, not a finished composition.

Locked homepage order:

```text
NeedleLoader
-> Header
-> HeroTypographicField
-> ServiceTickerBridge
-> CinemaSequence
-> ConversionBridge
-> FooterPayoff
-> InternalPages
```

Hero rule:

```text
Hero = powerful typography placeholder + subtle CTA/scroll cue + uploaded HTML vector-field background only.
```

The uploaded HTML file is used only for the hero canvas field. Do not copy anything else.

# 1. The uploaded HTML background effect: exact translation

The uploaded HTML hero has a canvas called `field`. It creates a directional vector field using many small line segments arranged in a grid. Each segment rotates toward an attractor. The attractor follows the mouse on desktop and moves in an ambient orbit when idle. Lines close to the attractor become warmer/champagne and slightly brighter.

Build this as a reusable component:

```text
<HeroFieldBackground />
```

## 1.1 Behaviour requirements

- Canvas fills the hero section.
- Canvas sits behind typography.
- Strokes are short directional lines, not dots or particles.
- Grid spacing changes by screen width.
- Desktop: attractor follows cursor while cursor is inside or near the hero.
- Idle: attractor follows a slow orbit.
- Mobile/touch: ambient orbit only.
- Proximity brightens strokes and shifts some strokes to champagne.
- Distant strokes stay low-opacity ivory/graphite.
- Small node points can appear only near high proximity.
- Animation must pause when hero is off-screen.
- Reduced-motion mode must render a static field.

## 1.2 What not to copy from the uploaded HTML

Do not copy:

- hero text,
- Steer Intelligence naming,
- The Blank Group references,
- coordinates,
- HUD corner frame,
- custom cursor,
- header,
- navigation,
- service sections,
- pricing,
- forms,
- footer,
- any layout except the background-field concept.

# 2. Hero section specification

## 2.1 Component

```text
<HeroTypographicField>
  <HeroFieldBackground />
  <HeroContentShell />
</HeroTypographicField>
```

## 2.2 Hero content shell

The hero content is not final. It should be implemented using placeholders that are easy to change.

Required placeholders:

```text
[HERO_HEADLINE_TBD]
[HERO_SUBCOPY_TBD]
[PRIMARY_CTA_TBD]
[SCROLL_INSTRUCTION_TBD]
```

Do not write final marketing copy unless the user provides it.

## 2.3 Hero visual style

- Large Fraunces-led typography.
- Strong editorial spacing.
- Subtle IBM Plex Mono label/instruction.
- One or two restrained CTA elements only.
- No cards.
- No product mockups.
- No feature grid.
- No background images other than the vector-field canvas.

## 2.4 Hero motion

Allowed:

- text mask reveal on initial entry,
- subtle blur-to-sharp for hero type,
- background field responding to cursor/idle orbit,
- scroll cue hairline animation.

Not allowed:

- hero becoming the logo cinema,
- huge service carousel inside hero,
- random 3D objects,
- copying the uploaded HTML's exact content.

# 3. Needle loader specification

The needle loader remains the first site moment.

Scroll/timing behaviour:

1. Page opens in obsidian field.
2. Secondary needle appears.
3. Needle calibrates through small rotational correction.
4. Needle aligns to 0 degrees toward the right.
5. Needle traces/exits into hero field.
6. Hero field reveals.

The loader must be short. It should not delay the site unnecessarily.

# 4. Service ticker bridge specification

After hero, build a bridge that prepares the user for the cinema.

Component:

```text
<ServiceTickerBridge>
  <MovingServiceBelt />
  <CenteredPrimarySeal />
  <ScrollToSteerInstruction />
</ServiceTickerBridge>
```

Allowed ticker terms:

```text
WEBSITES · AI AUTOMATION · SAAS PRODUCTS · CRM SYSTEMS · DASHBOARDS · ANALYTICS · GROWTH INFRASTRUCTURE
```

Motion:

- slow horizontal motion,
- pause or slow on hover,
- no fast ticker-tape feeling,
- centered primary seal remains calm,
- scroll instruction pulses subtly.

# 5. Cinema sequence specification

The cinema starts after the ticker bridge.

Component:

```text
<CinemaSequence>
  <CinemaPin>
    <CameraRig>
      <AmbientDepthLayer />
      <LogoWorldLayer />
      <SquareTraveler />
      <CinemaTextReveals />
      <ForegroundGrain />
    </CameraRig>
  </CinemaPin>
</CinemaSequence>
```

## 5.1 Main rule

The cinema is the blank canvas below the service bar. This is where the reference-inspired effects belong, but only in translated buildable form.

Effects to include:

- Radian-like route journey translated as camera-tracked logo-world travel.
- Ouro-like text reveal translated as masked Fraunces line reveal.
- New Genre-like storytelling translated as sparse node-based reveal sequence.
- Non-Linear-like text hover translated as restrained hover on selected words.
- Daylight/Ouro footer polish translated as final period landing and hover.
- MIUX-like smooth transition translated as clean bridge between ticker, cinema and footer.

## 5.2 No-card rule

Cinema must not use cards, boxes, icons, dashboards, SaaS grids or mockups.

Only use:

- primary seal geometry,
- S-route,
- champagne square,
- large typography,
- mono labels,
- hairlines,
- subtle CTAs,
- negative space,
- atmospheric depth.

# 6. Cinema scroll timeline

Suggested range: 500vh to 800vh pinned sequence.

| Scroll progress | Zone | Behaviour |
|---|---|---|
| 0-8% | Entry from ticker | primary seal begins to enlarge |
| 8-18% | Logo-world entry | camera pushes into seal; S-cut becomes aperture |
| 18-28% | Route lock | square becomes active traveler; path illumination begins |
| 28-40% | Node 01 | first phrase reveal |
| 40-52% | Node 02 | second phrase reveal |
| 52-64% | Node 03 | third phrase reveal |
| 64-76% | Node 04 | fourth phrase reveal |
| 76-86% | Conversion | route slows; CTA phrase appears |
| 86-100% | Footer payoff | square exits route and lands as period |

# 7. Cinema text reveal grammar

Every cinema text reveal must be triggered by the square's progress, not independent scroll fade.

Reveal grammar:

1. Square approaches node.
2. S-route glow brightens.
3. Mono label appears first.
4. Fraunces phrase reveals through mask.
5. Optional short line appears.
6. Optional CTA appears.
7. Text softens/recedes as square leaves.

Example placeholder format:

```text
NODE 01 / [CAPABILITY_LABEL]
[PHRASE_TBD]
[SUPPORTING_LINE_TBD]
```

Do not lock final copy unless supplied.

# 8. Square traveller rules

The champagne square is the main character of the cinema.

Required:

- visible size,
- soft glow,
- trail,
- acceleration/deceleration,
- node pulse,
- same element persists until footer period,
- no teleporting,
- no abrupt period appearance.

# 9. Footer payoff

The square completes the S-route, slows, exits the route, and lands after the IBM Plex Mono wordmark:

```text
STEERWAY.
```

The period must be the same square.

Sequence:

1. Route glow fades behind square.
2. Camera flattens from cinema to footer plane.
3. `STEERWAY` appears.
4. Square moves into exact period position.
5. Soft glow.
6. Stillness.

# 10. Hover and micro-interaction system

## 10.1 Hero

- CTA hover: champagne underline or edge trace.
- Scroll cue: hairline pulse.
- Background field: cursor-reactive attraction.

## 10.2 Ticker bridge

- Service terms may slow on hover.
- Center seal may have tiny champagne square pulse.
- No extra hover cards.

## 10.3 Cinema

- Selected large words may respond with subtle magnetic or blur-sharp hover.
- CTAs use champagne line trace.
- No popover cards.

## 10.4 Footer

- Hover on period triggers micro S-route pulse.
- Wordmark letters breathe subtly.
- Footer links use champagne path underline.

# 11. Internal pages

Internal pages use needle mapping, not homepage cinema.

Each internal page should have:

- powerful but simpler typographic hero,
- subtle version of hero field or static graph background if needed,
- needle route diagram,
- service explanation,
- use cases,
- proof or capability list,
- CTA to deck, audit, quote, roadmap, or discovery.

No public pricing unless approved later.

# 12. Mobile and reduced-motion rules

## Mobile

- Hero field becomes lighter/static if performance requires.
- Ticker remains slow and readable.
- Cinema becomes a simplified vertical route or scroll-by-scenes.
- Text remains readable above motion.

## Reduced motion

- Needle loader becomes quick fade.
- Hero field becomes static directional lines.
- Cinema becomes stepped static panels.
- Square period payoff becomes a simple controlled transition.

# 13. Acceptance checklist

Reject build if:

- Hero includes final copy not approved by user.
- Hero copies any text from uploaded HTML.
- Hero background is not the vector-field behaviour.
- Uploaded HTML influences anything other than hero background.
- Cinema starts before hero.
- Cards return in cinema.
- Square does not drive reveals.
- Footer period is not the same square.
- Internal pages repeat full cinema.
- Website mentions Blank Group or Steer Intelligence.

# 14. Final AI-platform prompt for V3

```text
Use the V3 documents as source of truth.
Critical correction: the hero section is not final-designed. Build only a powerful typographic hero shell with placeholder text, subtle CTA/scroll cue, and the uploaded HTML's vector-field canvas background. Do not copy any other part of the uploaded HTML.
After hero, build the service ticker bridge. Then start the primary-seal cinema: seal becomes logo-world, square travels S-route, typography-only story reveals, conversion bridge, and STEERWAY period payoff.
No cards in cinema. No generic SaaS layout. No Blank Group or Steer Intelligence traces.
```
