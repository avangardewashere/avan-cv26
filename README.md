# avan-cv26

Portfolio v2 for Avel Panaligan, built on `portfolio/` (same content and dark lime design). What's new: the first screen is a swipeable run of promos for the latest builds, **AMYGO** and **BuildOS**, and an About section comes right after it. Design rules are in [DESIGN.md](DESIGN.md).

```bash
npm install
npm run dev
```

## The first screen

`components/home/hero-carousel.tsx`, with the promos in `content/profile.ts` → `promos`.

1. Each promo plays its video once (muted, with pause and, where the video has audio, sound), then crossfades to its banner.
2. After `PROMO_BANNER_SECONDS` (5) the next promo starts; the last banner stays. Pause holds the video and the countdown.
3. Swipe (touch, trackpad) or use the `|` pagination. Once a visitor picks a slide, the hero stops advancing on its own; a slide already watched shows its banner, with **Replay video** and **About the project**.
4. Reduced motion starts on the banners and never advances on its own.

## About

`components/home/about.tsx`, with its text in `content/profile.ts` → `about`. It replaces the old intro: a short story, a facts card, and the four career figures. Every claim in it comes from the résumé.

## Media

The video files are in `public/media/`. AMYGO's are re-encoded from the 23 MB master (`C:/Users/USER/Videos/amygo.mp4`); BuildOS's from `BuildOs.mp4` (5 s, no audio: `-an`, CRF 26/27):

```bash
ffmpeg -i amygo.mp4 -vf "fps=30,scale=1920:-2" -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart gym3d-promo-1080.mp4
ffmpeg -i amygo.mp4 -vf "fps=30,scale=1280:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart gym3d-promo-720.mp4
ffmpeg -ss 2.6 -i amygo.mp4 -frames:v 1 poster.png   # then save as gym3d-promo-poster.webp
```

The posters (`amygo-landscape-*.webp`, `amygo-portrait-*.webp`) are WebP copies of `amygo landscape.png` and `amygo portrait.png` from the same folder. The landscape poster is also the project banner (`public/projects/gym3d-banner-*.webp`).
