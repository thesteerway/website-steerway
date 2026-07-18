# Studio Proof Reel: Motion-Graphics Video Prompts

Six clips for the Studio page's proof reel (`STUDIO.proof` in `web/lib/internal.ts`).
Usage: paste the MASTER STYLE BLOCK first, then ONE storyboard prompt below it.
Generate one clip per run. Target filenames (drop into `web/public/proof/`):

| # | family id        | filename            |
|---|------------------|---------------------|
| 1 | websites         | `websites.mp4`      |
| 2 | saas             | `saas.mp4`          |
| 3 | ai-automation    | `ai-automation.mp4` |
| 4 | crm-growth       | `crm-growth.mp4`    |
| 5 | data-dashboards  | `data-dashboards.mp4` |
| 6 | growth-infra     | `growth-infra.mp4`  |

Export: 1600x1000 (16:10), 30fps, 6.0s PERFECT seamless loop, silent,
H.264 MP4 under ~2MB (plus WebM if possible), first frame saved as poster PNG.
If the tool outputs an animated HTML/CSS page instead of a video file, keep all
animation on 6s CSS loops and screen-record at 2x device pixel ratio.

---

## MASTER STYLE BLOCK (paste at the top of every prompt)

You are producing a premium motion-graphics UI vignette for The Steerway, a
systems studio. The mood is a cockpit instrument at night: dark, precise,
calm, expensive. NOT a bubbly SaaS explainer.

CANVAS: 1600x1000 (16:10). Background solid #0a0a0c with a very subtle warm
radial lift at center (rgba(44,40,33,0.35), fading out by 70%). Optional 3%
film grain overlay.

PALETTE (strict, no other hues):
- Obsidian #0a0a0c: background
- Graphite #131316 and #17171b: panels, cards
- Ivory #ece7dd: primary text and key UI strokes
- Ivory-dim #c9c4bb: secondary text
- Mist #837f77 / #565149: tertiary text, faint elements
- Champagne #c3a268: THE accent. Reserved for anything alive, moving, or important
- Bronze #96762f: tiny labels, ticks
- Hairlines: rgba(236,231,221,0.09)

TYPE:
- Display: Fraunces Light 300, serif, only for one hero-scale line if needed
- Mono: IBM Plex Mono for ALL labels, data, statuses; UPPERCASE, letter-spacing 0.2em
- Body: Inter
- All microcopy must be plausible and specific. Never lorem ipsum. No em dashes.

MOTION LANGUAGE:
- Easing: cubic-bezier(0.16, 1, 0.3, 1) on everything except conveyor/линear ticker motion
- Reveals: masked rises, blur-to-sharp, hairlines that draw themselves
- ONE guiding object: a small champagne square (about 14px). It is the studio's
  traveler mark. It acts as the cursor/actor that CAUSES every event in the scene:
  it glides, docks, clicks, drags, rides route lines. Give it a soft glow:
  0 0 20px rgba(195,162,104,0.5)
- Route lines: 1.5-2px champagne lines that draw with dash-offset, like a surveyor
  plotting a course
- Pace: calm and confident. Few elements, lots of dark negative space. One event
  at a time. Nothing bounces, nothing wiggles.

HARD RULES: dark UI only. No photos, no stock footage, no emojis, no purple or
blue gradients, no glassmorphism blobs, corner radius 2-4px max, no drop shadows
except the champagne glow, no watermark, no third-party brand names or logos, no
pricing or currency amounts on screen. Duration exactly 6.0s at 30fps and the
last frame must equal the first frame (seamless loop). Silent.

---

## 1. WEBSITES THAT CONVERT (`websites.mp4`)

Scene: a premium landing page converts a visitor and routes the lead.

- 0.0s: Ivory hairline browser frame draws itself on (top bar with three dim
  lamp dots, mono address "yourclinic.in"). Interior dark.
- 0.6s: A Fraunces Light headline rises out of a mask inside the page:
  "Book a visit in 60 seconds." A one-line Inter subline fades in dim below.
- 1.5s: The champagne traveler square glides in from the left edge as the
  cursor. It underlines the CTA button "BOOK NOW" (mono label, champagne fill)
  with a drawn champagne line, then presses it: the button dips 2px and flashes.
- 2.5s: A minimal form panel wipes in (two underlined fields). The fields
  type on in mono: "Asha Rao", "+91 98x xx xx".  A caret blinks.
- 3.7s: Submit. The traveler square detaches from the button and rides a
  freshly drawn champagne route line to the right edge, docking into a small
  graphite chip labeled "CRM". The chip lights ivory. A mono stamp appears:
  "LEAD ROUTED / 0.4S".
- 4.9s: A slim metrics strip fades in at the bottom: "CONVERSION 4.1" counts
  up, and a small gauge arc sweeps to "98" in champagne (performance score).
- 5.5s: Everything inside the browser dims to 10% and the traveler square
  glides back to its 0.0s position as the interior resets. Frame 180 = frame 0.

## 2. SOFTWARE PEOPLE LOG INTO (`saas.mp4`)

Scene: a role-based portal assembles itself and processes one booking.

- 0.0s: A graphite sidebar slides in from the left (five dim mono nav items,
  one lit ivory). Top bar draws as a hairline with a small "ADMIN" bronze chip.
- 0.8s: A workspace grid of five graphite cards assembles with staggered masked
  rises (stat tiles with mono labels: "TODAY 34", "PENDING 6", "OCCUPANCY 82").
  Numbers count up.
- 1.6s: The traveler square, acting as cursor, presses "NEW BOOKING". A modal
  draws itself: hairline border, plan-sheet wipe from the top.
- 2.6s: Modal fields type on in mono: "Room 204", "Fri 18:00", assignee chip
  "PRIYA". Confirm button fills champagne.
- 3.6s: The square presses confirm. The modal collapses into a single table
  row that inserts itself into a list below, highlighted champagne for a beat,
  then settling to ivory-dim. The "PENDING" stat ticks 6 to 7.
- 4.6s: Three tiny presence dots blink in the top bar with mono
  "3 TEAMMATES ONLINE". A subtle sync pulse crosses the cards left to right.
- 5.4s: The modal state clears, stats roll back during a brief 8-frame dim,
  returning exactly to the 0.0s composition. Seamless.

## 3. AGENTS THAT ANSWER (`ai-automation.mp4`)

Scene: an AI assistant answers a customer chat and books the slot, no human.

- 0.0s: A dark chat pane draws itself center-left (hairline frame). Above it,
  a mono status rail: "AGENT / IDLE".
- 0.6s: Incoming customer bubble (graphite, left-aligned, Inter):
  "Do you have a slot tomorrow evening?"
- 1.2s: Status rail flips to "AGENT / READING CALENDAR". A typing indicator
  bubble appears: three champagne dots pulsing in sequence.
- 2.2s: Agent reply bubble (right-aligned, champagne-tinted border) types on:
  "Yes. 6:30 pm is open. Want me to book it?"
- 3.0s: Two quick-reply chips slide up: "BOOK 6:30" and "OTHER TIMES". The
  traveler square glides in and presses "BOOK 6:30".
- 3.8s: A champagne route line draws from the chat toward a right-side rail of
  three small nodes labeled in mono: CALENDAR, CRM, CONFIRMATION. The square
  rides the line; each node lights ivory as it passes.
- 5.0s: A final bubble stamps in: "Booked. Reminder set." Below the pane a
  mono line appears: "NO HUMAN IN THE LOOP / 11S END TO END".
- 5.5s: Chat content fades down through a short dim while the frame and rail
  persist; square returns to entry position. Loop closes at 6.0s.

## 4. PIPELINES THAT FOLLOW UP (`crm-growth.mp4`)

Scene: one lead travels a pipeline while automation does the chasing.

- 0.0s: Three graphite columns draw in with mono heads: "NEW 3", "CONTACTED 5",
  "WON 12". Hairline separators. A faint activity timeline rail on the right.
- 0.8s: A lead card drops into NEW with a soft settle: "R. Mehta" over
  "Website form / 2 min ago" in mist.
- 1.6s: A bronze chip stamps onto the card: "AUTO FOLLOW-UP". Beneath it a mono
  line types: "whatsapp sent · 0:12". The timeline rail logs the same entry.
- 2.6s: The traveler square grips the card and drags it smoothly into
  CONTACTED. Column counters tick. Timeline logs "email opened", "replied yes".
- 4.0s: The card slides into WON, flashes champagne once. From the card a thin
  champagne attribution line draws downward into a mini bar labeled
  "SOURCE: PAID SOCIAL" which lights up.
- 5.0s: A new identical lead card drops into NEW, which is visually the 0.8s
  event; during the drop the WON card and attribution line fade to their 0.0s
  state. Loop is seamless at 6.0s.

## 5. NUMBERS THAT AGREE (`data-dashboards.mp4`)

Scene: one dark dashboard where every number reconciles.

- 0.0s: A mono KPI row stamps in item by item across the top: "LEADS 214",
  "CONVERSION 4.1", "RESPONSE 0:42", "SHOW-UPS 78". Numbers count up from 0.
- 1.2s: A bar chart rises: seven graphite bars scale up from the baseline with
  stagger; the current bar is champagne and slightly taller.
- 2.2s: A line chart draws itself left to right with dash-offset. The traveler
  square rides the line like a route, and at the peak it docks: a small chip
  stamps "MAY 12 / 38 LEADS".
- 3.6s: A gauge arc sweeps to 82 in champagne bottom-left; next to it a source
  legend types on in mono: "paid social / search / referral / direct", each
  with a small ivory tick.
- 4.7s: A single champagne hairline sweeps vertically across all charts once,
  and every figure does a subtle 1-frame reconcile blink, mono stamp bottom
  right: "ALL SOURCES AGREE".
- 5.4s: Charts and counters ease back to zero through a brief dim while the
  frame persists; square returns to the line's start. Frame 180 = frame 0.

## 6. THE LAYER UNDERNEATH (`growth-infra.mp4`)

Scene: five disconnected tools become one connected operating layer.

- 0.0s: Five small graphite node chips fade in scattered across the dark
  canvas, mono labels: "ADS", "SITE", "CRM", "WHATSAPP", "REPORTING". They sit
  dim in mist, unconnected. Subtle dotted hairline ring behind them.
- 1.0s: Champagne route lines draw between the nodes one at a time in a smooth
  S-shaped course (ADS to SITE to CRM to WHATSAPP to REPORTING). Each
  connection pings its node with a small ring.
- 2.6s: The traveler square launches from ADS and rides the full route. As it
  passes each node, the chip flips from mist to ivory and a tiny mono readout
  ticks beneath it: "event", "lead", "message", "reply".
- 4.2s: Arriving at REPORTING, the chip expands slightly and a miniature bar
  chart pops inside it, bars rising. A mono stamp settles center-bottom:
  "ONE CONNECTED LAYER".
- 5.2s: The route lines dim to 20%, node chips ease back to mist, the square
  glides back to ADS along the dimmed route. Loop closes seamlessly at 6.0s.

---

## After generating

1. Check the loop: scrub last frame against first, they must match exactly.
2. Compress: H.264, CRF ~26, target under 2MB per clip; also export WebM (VP9).
3. Save the first frame of each as `<name>-poster.png`.
4. Drop files in `web/public/proof/` and tell Claude Code to wire them into
   `ProofReel` (the `[DEMO_VIDEO_TBD]` slots swap the vignette for
   `<video muted loop playsInline preload="none" poster=...>`).
