# Standard Cantonese for Mandarin Speakers

Static, content-driven Cantonese learning app for Mandarin-speaking adults. The first production slice is intentionally small: a polished A1 starter path, local progress only, and bundled static audio placeholders that can be replaced later without changing the app architecture.

## Architecture

- `React + TypeScript + Vite`
- Static output only, compatible with GitHub Pages
- Local-first state with `localStorage` for progress and preferences
- Content lives in typed data files instead of hardcoded lesson JSX
- Audio is manifest-based and points to bundled static files under `public/audio`
- Script conversion is browser-side so the same content can render in Traditional or Simplified Chinese

The product is designed around a freeCodeCamp-style curriculum map: sections contain lessons, lessons contain ordered step types, and step rendering is driven by content data.

## Content Model

The content layer should stay stable and scalable:

- `section`
  - Stable id
  - Display title
  - Summary and A1 checkpoint grouping
- `lesson`
  - Stable id
  - Section id
  - Title
  - Step list
  - Optional unlock and completion metadata
- `step`
  - Discriminated union by type
  - Examples: learn card, listen-and-choose, Jyutping practice, tone drill, reorder, fill blank, signage reading, repeat machine, quiz item
- `lexicon`
  - Stable id
  - Traditional Chinese
  - Simplified Chinese
  - Jyutping
  - Mandarin gloss in Chinese
  - Optional note and audio reference
- `audio manifest`
  - Maps stable ids to static asset paths
  - Includes speaker identity where relevant
  - Allows the UI to degrade gracefully when an asset is missing

Keep content in Chinese for v1. Author lesson copy in Traditional Chinese and convert for display at runtime.

## Adding Lessons

1. Add or update the section and lesson records in the content files.
2. Create steps using the existing step union instead of embedding ad hoc JSX.
3. Add any new glossary items to the lexicon so hover/tap popovers stay reusable.
4. Register audio ids in the manifest if a step or phrase expects playback.
5. Keep ids stable. Progress, review flags, and quiz results should not break when copy changes.

Guidelines for new A1 content:

- Prefer short, bite-sized steps
- Focus on recognition and listening before recall
- Keep explanations practical and adult-facing
- Use one canonical Cantonese answer per exercise
- Avoid variant clutter and avoid non-course topics

## Audio Assets

Place bundled files under `public/audio`. The runtime should request them by manifest key rather than by hardcoded UI strings.

Recommended pattern:

- `public/audio/README.md`
- `public/audio/manifest.json` or a generated equivalent
- `public/audio/<section-id>/<lesson-id>/<asset-id>.mp3`

Asset rules:

- Use consistent male and female speaker identities for dialogue
- Support playback at `1.0x`, `0.75x`, and `0.5x`
- If a file is missing, the UI should show a placeholder state instead of crashing
- Do not rely on browser TTS for production flows

## GitHub Pages Deployment

The app is static, so deployment should publish the Vite build output to GitHub Pages.

Notes:

- Set the Vite `base` path correctly for the repository name
- Publish the built `dist` directory
- Keep all app assets relative and bundled for static hosting
- Verify client-side routing works under the Pages subpath

Common deploy flow:

1. Build the app.
2. Publish the generated static files to the Pages branch or deployment target.
3. Confirm refresh behavior on nested routes.
4. Confirm audio asset URLs resolve under the repository base path.

## Future Scaling TODOs

- Expand from A1 into A2, B1, B2, C1, and C2 with the same content schema
- Add richer review scheduling without moving away from local storage
- Replace placeholder audio with complete bundled narration and drills
- Add stronger pronunciation practice while keeping scoring non-authoritative
- Broaden the lexicon and lesson map without changing stable ids
- Add optional English support only after the Chinese-first experience is solid

## Repository Notes

This repo is currently being scaffolded. The first slice should optimize for clarity, maintainability, and future content expansion rather than feature breadth.
