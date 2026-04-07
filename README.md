# Standard Cantonese for Mandarin Speakers

Static, content-driven Cantonese learning app for Mandarin-speaking adults. The product is now organized around one linear path:

1. Chapter 1: learn Cantonese pronunciation through Jyutping
2. Chapter 2: learn the characters and grammatical patterns that differ from Mandarin
3. Endless practice mode for long-term spaced repetition and refinement

The current implementation is still an early production slice, but the product direction is now explicitly built around those two onboarding chapters plus the long-tail drill system.

## Architecture

- `React + TypeScript + Vite`
- Static output only, compatible with GitHub Pages
- Local-first state with `localStorage` for progress and preferences
- Content lives in typed data files instead of hardcoded lesson JSX
- Audio is manifest-based and points to bundled static files under `public/audio`
- Script conversion is browser-side so the same content can render in Traditional or Simplified Chinese
- Routing uses `HashRouter`, so deep links stay GitHub Pages-safe without any server rewrites

The product is designed around a simple learner-facing flow:

- curriculum home
- Chapter 1 pronunciation and Jyutping foundations
- Chapter 2 Cantonese-specific characters and sentence patterns
- endless practice for high-volume review

Under the hood, the content model is still typed and modular so the curriculum can scale toward A1–C2 without changing the static architecture.

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
- `commonCharacters`
  - Bundled 5k single-character Jyutping dataset
  - Lazy-loaded so the initial lesson bundle stays small
- `commonStructures`
  - Bundled 10k common pairs, phrases, idioms, and sayings
  - Generated from local frequency + dictionary data and lazy-loaded at runtime

Keep content in Chinese for v1. Author lesson copy in Traditional Chinese and convert for display at runtime.

## Adding Lessons

The preferred authoring direction is now:

1. Add or update Chapter 1 pronunciation lessons that teach tones, initials, finals, and follow-up labs.
2. Add or update Chapter 2 short-sentence lessons that target Mandarin interference and Cantonese-specific forms.
3. Expand endless practice decks so learners can keep cycling through 5k characters and high-frequency structures.

General rules:

1. Add or update the section and lesson records in the content files.
2. Create steps using the existing step union instead of embedding ad hoc JSX.
3. Add any new glossary items to the lexicon so hover/tap popovers stay reusable.
4. Register audio ids in the manifest if a step or phrase expects playback.
5. Keep ids stable. Progress, review flags, and quiz results should not break when copy changes.

Guidelines for new chapter content:

- Teach Jyutping directly instead of leaning on other phonetic systems
- Focus first on Cantonese points that materially differ from Mandarin
- Prefer short, high-value sentence contexts over long explanation
- Use one canonical Cantonese answer per exercise
- Avoid variant clutter and avoid non-course topics

## Vocabulary Corpora

The app now ships two static helper corpora for autocomplete and recognition support:

- `src/content/commonCharacters.ts`
  - 5,000 high-frequency single characters with canonical Jyutping and alternate readings
- `src/content/commonStructures.ts`
  - 10,000 high-frequency structures built from the same 5k character band
  - Mix of two-character words, short phrases, idioms, and a small sayings bucket

Generation commands:

1. `npm run generate:characters`
2. `npm run generate:structures`
3. `npm run generate:vocabulary`

Source notes:

- Character ranking comes from the bundled `hanzi` frequency list
- Multi-character structure ranking comes from `hanzi`'s bundled Leiden frequency data plus CC-CEDICT matches
- Jyutping is generated with `to-jyutping`
- The generators deliberately filter out obvious proper nouns, political/history/religious content, and noisy dictionary variants so the shipped data stays learner-facing

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

The app is fully static and ready for GitHub Pages.

- `vite.config.ts` uses `base: './'` so assets resolve correctly from a Pages subpath
- `src/main.tsx` uses `HashRouter`, so refreshes on nested app routes do not require a custom `404.html`
- `.github/workflows/deploy-pages.yml` will build and deploy automatically when you push to `main`
- `public/.nojekyll` is included so Pages serves the generated Vite output without Jekyll interference

Recommended GitHub setup:

1. In GitHub, open `Settings > Pages`.
2. Set `Source` to `GitHub Actions`.
3. Push to `main`.
4. Wait for the `Deploy GitHub Pages` workflow to finish.
5. Open the published Pages URL.

Local verification before push:

1. Run `npm ci`.
2. Run `npm run build`.
3. Optionally run `npm run preview`.

## Local Storage

Progress and preferences are stored only in the browser via `localStorage`.

- Storage key: `standard-cantonese:app-state:v1`
- Stored data includes lesson completion, quiz scores, review-later flags, arcade stats, theme, script preference, and playback speed
- Export/import/reset is available in the in-app settings page
- No backend, account, or cloud sync is required for the app to function

## Future Scaling TODOs

- Expand the two onboarding chapters until they cover the full high-transfer Mandarin-speaker path into Cantonese
- Map the same curriculum into A1, A2, B1, B2, C1, and C2 depth bands without changing the learner-facing three-part structure
- Add richer review scheduling without moving away from local storage
- Replace placeholder audio with complete bundled narration and drills
- Add stronger Chapter 1 typing and read-aloud labs while keeping scoring non-authoritative
- Broaden the lexicon and lesson map without changing stable ids
- Add optional English support only after the Chinese-first experience is solid

## Repository Notes

This repo is currently being scaffolded. The first slice should optimize for clarity, maintainability, and future content expansion rather than feature breadth.
