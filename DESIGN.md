# Design System: Avel Panaligan · Portfolio v2 (avan-cv26)

## 1. Visual Theme & Atmosphere

A dark, confident engineering portfolio. It reads like a well-lit studio at night: near-black canvas, one lime accent, and real product media doing the talking. Density is "Daily App Balanced" (4), variance is "Offset Asymmetric" (6), and motion is "Fluid CSS" (5): springy, purposeful, and never decorative. The background carries no ornament; the projects' own videos, banners and screenshots are the imagery.

The first screen is a swipeable run of full-bleed project promos. Everything that sits on top of moving footage is built for legibility first.

## 2. Color Palette & Roles

- **Night Canvas** (#0A0A0B): page background in the dark theme (the default).
- **Raised Surface** (#141416): cards, the About tabs, experience rows.
- **Paper Ink** (#F5F5F7): primary text in the dark theme.
- **Muted Steel** (#9A9AA3): secondary text, summaries, metadata.
- **Subtle Steel** (#7D7D88): labels, years, counters.
- **Lime Signal** (#C8FF4D): the single accent. Primary buttons, active pagination bar, metrics, focus rings. In the light theme its text form is **Deep Olive** (#3F6B00), because lime on white fails contrast.
- **Media Chip** (rgb(10 10 11 / 0.7), blurred): the backing for every control over video or banners.
- **Hairline** (white or ink at 6–14% opacity): 1px structural borders.

The brand lime is more saturated than a generic accent on purpose. It appears in small areas only: one bar, one button, a few figures. There is no second accent, no purple glow and no gradient text.

## 3. Typography Rules

- **Display:** Bricolage Grotesque 700. Tight tracking (-0.03 to -0.04em) with optical sizing. Hierarchy comes from weight and the lime tail of a headline, not raw size.
- **Body:** Geist 400–600. Relaxed leading (1.5–1.65) and at most about 62 characters per line.
- **Mono:** Geist Mono. Eyebrows, years, counters, the pagination label, uppercase with 0.06–0.12em tracking.
- **Banned:** Inter, generic serifs, and a serif mixed into a sans headline.

## 4. Component Stylings

- **Buttons:** Full pills. The primary uses a Lime Signal fill with Night Canvas text. The secondary is an outline pill, or a Media Chip pill over media. On press, each scales to 0.98. No outer glow.
- **Cards:** Rounded 24px, with a 1px hairline border and a flat surface. They are used only where a card is a real object (a project). Inner media radii are concentric: 23px, the card radius less its border.
- **Trays:** Double bezel: a 26px tray with 6px padding holding 19px plates. Used for the About tabs.
- **Chips and tags:** Full-pill, mono uppercase for kinds of work, and quiet ink pills for stack tags.

## 5. Hero: Swipeable Promos (legibility rules)

- Each promo plays its video once and then crossfades to its banner. The banner holds for 5 seconds before the next promo starts, and the last banner stays. There is no endless loop.
- **Pagination is a row of `|` bars,** one per promo, on a Media Chip pill:
  - Inactive bars are white at 45% opacity, 3 × 14px.
  - The active bar is Lime Signal at full opacity, 3 × 24px.
  - Each bar has a 28 × 44px hit area.
  - The current project's name sits beside the bars in uppercase mono, white on the chip.
- **Over any media,** text and marks only ever sit on the Media Chip (70% near-black plus blur). Over the brightest frame that backing stays at roughly 6:1 or better for white text. Inactive bars clear 3:1 against it.
- **A 2px progress line** runs along the hero's bottom edge: Lime Signal on the Media Chip's near-black, filling over the video plus the 5-second banner hold. It reaches the end exactly when the next promo starts, and it hides when nothing comes next (the last promo, after the visitor picks a slide, reduced motion).
- **One Pause control** holds the video, the countdown to the next promo and the progress line. Sound appears only where a video has an audio track. Every control is at least 44px.
- **No overlap:** controls live in their own bottom band.
  - On tall screens, the banner is shown whole between the header and that band.
  - On wide screens it bleeds, with the type side anchored so cropping only ever trims imagery.
- **When it stops moving on its own:** reduced motion starts on the banners and never advances by itself. Once a visitor picks a slide by swiping or tapping a bar, auto-advance stops too.

## 6. Layout Principles

- One column of content, 1200px max, with a fluid `--gutter` (clamp 20–40px) shared by anything that bleeds into it.
- Asymmetric splits where content earns them: the About section runs 5fr/7fr. Strict single-column collapse below 760px.
- Horizontal rails (Work) use native scroll-snap. Part of the next card always peeks, the scrollbar is hidden, and Prev/Next plus a counter are the pointer alternative.
- Full-height sections use `svh`, never `h-screen`.
- No horizontal page scroll at any width from 320px up.

## 7. Motion & Interaction

- The house curves are `--ease-fluid` (0.32, 0.72, 0, 1) for enter and expand, and `--ease-soft` for hover. Durations: hover 200ms, lift 450ms, expand 500ms, reveal 800ms.
- Only `transform`, `translate`, `opacity` and `rotate` are animated. Scroll-linked work runs on IntersectionObserver or CSS, never a scroll listener.
- Every moving thing has a stop. Reduced motion removes smooth scrolling, the crossfades' travel and autoplay.

## 8. Anti-Patterns (Banned)

- Text or marks laid directly on video or banners without the Media Chip backing.
- Dot pagination, numbered "01 / 02" pagers, or progress bars over media in place of the `|` bars.
- Autoplay that loops forever, or that cannot be paused.
- A second accent colour, neon or outer glows, gradient headline text, and pure black (#000000).
- Emojis, Inter, and generic serif fonts.
- Filler UI such as "Scroll to explore", bouncing chevrons or scroll arrows.
- Em-dashes in visible copy.
- Claims that do not trace to the résumé or a confirmed fact.
