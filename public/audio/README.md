# Audio Placeholder Notes

This directory is reserved for bundled static audio used by the app.

The production app should load audio from a manifest keyed by stable asset ids. If an asset is missing, the UI must show a graceful placeholder state and continue working.

Recommended layout:

- `public/audio/manifest.json`
- `public/audio/<section-id>/<lesson-id>/<asset-id>.mp3`

Expected behavior:

- Dialogue should keep consistent male and female speaker identities
- Playback should support `1.0x`, `0.75x`, and `0.5x`
- Missing assets should not block lesson progression
- Browser TTS should not be used as the primary production audio source

Replace these placeholder instructions with real bundled audio when the lesson content is wired up.
