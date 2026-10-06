# avan-cv26

Portfolio v2 for Avel Panaligan, built on `portfolio/` (same content and dark lime design). What's new: the first screen is a promo for the latest build, **AMYGO** (Gym 3D), and an About section comes right after it.

```bash
npm install
npm run dev
```

## The first screen

`components/home/promo-video.tsx`, with its settings in `content/profile.ts` → `promo`.

1. The promo video fills the screen and plays **once** (`promo.plays`), muted, with pause and sound buttons. The video has its own titles, so nothing else is laid over it.
2. When it ends, it crossfades to the AMYGO poster: the landscape poster on wide screens, the portrait one on tall screens. The poster has **Replay video** and **About the project** buttons.
3. Visitors with reduced motion turned on start on the poster.

## About

`components/home/about.tsx`, with its text in `content/profile.ts` → `about`. It replaces the old intro: a short story, a facts card, and the four career figures. Every claim in it comes from the résumé.

## Media

The video files are in `public/media/`, re-encoded from the 23 MB master (`C:/Users/USER/Videos/amygo.mp4`):

```bash
ffmpeg -i amygo.mp4 -vf "fps=30,scale=1920:-2" -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart gym3d-promo-1080.mp4
ffmpeg -i amygo.mp4 -vf "fps=30,scale=1280:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart gym3d-promo-720.mp4
ffmpeg -ss 2.6 -i amygo.mp4 -frames:v 1 poster.png   # then save as gym3d-promo-poster.webp
```

The posters (`amygo-landscape-*.webp`, `amygo-portrait-*.webp`) are WebP copies of `amygo landscape.png` and `amygo portrait.png` from the same folder. The landscape poster is also the project banner (`public/projects/gym3d-banner-*.webp`).
