# PRD: Standard Cantonese for Mandarin Speakers
## Static, freeCodeCamp-style web curriculum for Guangzhou-oriented colloquial Cantonese

Version: 1.0  
Status: Approved for initial build planning  
Primary implementation target: React + TypeScript + Vite + GitHub Pages  
Primary market for v1: Mandarin-speaking adults who want to function in Hong Kong and Guangdong

---

## 1. Product summary

Build a static web app that helps Mandarin speakers learn **standardized, Guangzhou-oriented colloquial Cantonese** through a freeCodeCamp-style interactive curriculum.

The course should feel:
- practical
- rigorous
- fast-moving
- adult
- playful enough to stay engaging
- optimized for recognition and listening before recall

The product should assume:
- the learner already speaks Mandarin
- the learner can read Chinese characters, but not at a highly academic level
- the learner wants to survive and enjoy Hong Kong / Guangdong travel, work, and everyday interaction
- the learner does **not** want politics, history, or anything likely to trigger censorship concerns

The app is fully static:
- no accounts
- no backend
- no moderation
- no database
- no server-side rendering requirement
- no external blocked embeds
- progress stored in browser local storage
- optional export/import of progress as JSON

---

## 2. Vision

Create the best “Mandarin speaker’s shortcut to Cantonese” on the web:
- more rigorous than Duolingo
- less academic than a textbook
- more practical than a phrasebook
- more transparent than an AI tutor
- more listening-heavy than most Chinese learning apps

The product should make learners feel:
1. “Because I already know Mandarin, this is surprisingly learnable.”
2. “I can actually hear and say Cantonese more accurately than I expected.”
3. “I can function in Hong Kong and Guangdong without feeling excluded.”

---

## 3. Core product principles

### 3.1 One standard target
Teach **one canonical “Standard Cantonese”** target for the whole app.

Editorial rule:
- treat Hong Kong and Guangzhou as one teaching target for v1
- preserve /n/ vs /l/ distinction in the canonical pronunciation target
- do not burden learners with variant lectures
- do not build answer logic around multiple regional variants
- use one canonical answer per exercise

### 3.2 Spoken colloquial Cantonese first
Target:
- everyday spoken Cantonese
- everyday colloquial written Cantonese as seen in accessible public-facing content
- signage, menus, transit, cashier talk, common notices, messaging-style reading

Do **not** prioritize:
- formal literary writing
- academic prose
- classical Chinese
- historical language explanation

### 3.3 Recognition over recall
Prioritize:
- listening discrimination
- phrase recognition
- sentence parsing
- character recognition
- tone recognition
- practical comprehension
- speaking with feedback loops

De-prioritize:
- handwriting
- stroke order
- memorizing rare characters for production
- requiring Chinese character typing
- requiring OS-level Jyutping input

### 3.4 Adult-smart pedagogy
Assume the learner is intelligent and already knows Mandarin.
Do not baby them.
Do not over-explain what already transfers from Mandarin.
Do explain deviations clearly and early.

### 3.5 Safe, apolitical, censorship-aware content
All content must stay in the domain of:
- travel
- hospitality
- food
- shopping
- transit
- directions
- networking
- conference attendance
- business meetings
- logistics
- payment
- scheduling
- everyday friendship and courtesy

Avoid:
- politics
- history
- religion
- protests
- government critique
- military / police scenarios
- identity controversy
- edgy humor
- profanity-heavy slang
- public-safety panic scenarios unless purely mundane and unavoidable

---

## 4. Target user

### Primary persona
A Mandarin-speaking adult from Singapore, mainland China, Taiwan, Malaysia, Indonesia, or the overseas Chinese diaspora who wants to:
- visit Hong Kong
- move around confidently
- make Cantonese-speaking friends
- handle service interactions
- attend a conference
- do practical business communication

### Secondary persona
An advanced Mandarin learner who can comfortably read Chinese and wants a fast route into Cantonese.

### Assumed user baseline
- can already parse Mandarin explanations
- can read common Chinese characters
- may be weaker on lower-frequency reading
- may never have studied phonetics seriously
- may understand that Cantonese differs from Mandarin, but not know how
- may strongly over-transfer Mandarin pronunciation habits

---

## 5. Success criteria

### Product success
Success looks like:
- the founder can send the app to Mandarin-speaking friends before a Hong Kong trip
- they actually use it
- they feel more capable and less excluded
- they report better listening confidence and practical survival ability
- they feel the course is fun but respects them as adults

### Learning success for end of A1
A learner who finishes A1 should be able to:
- greet people naturally
- thank, apologize, and get attention politely
- understand numbers, prices, and simple directions
- ask where things are
- order basic food and drinks
- check into a hotel
- navigate transit basics
- catch several of the highest-frequency Cantonese function words
- read common public-facing text in Hong Kong
- recognize and roughly produce Jyutping for core syllables
- hear and reproduce basic tone contrasts better than at the start

### UX success
- loads fast on weak networks
- works well on desktop, acceptable on mobile
- remembers progress locally
- has zero sign-up friction
- never feels cluttered or noisy

---

## 6. Non-goals for v1

Not in scope for v1:
- accounts
- cloud sync
- comments
- teacher dashboards
- moderation tools
- AI chat tutor
- backend pronunciation scoring
- handwriting recognition
- live multiplayer features
- server database
- external map embeds
- external fonts
- image-heavy content pipeline
- explanation language beyond Chinese
- detailed variant instruction for Hong Kong vs Guangzhou
- writing characters by hand

Stretch / future:
- English explanation mode
- richer arcade modes
- stronger on-device speech scoring
- native-speaker audio replacing TTS
- offline/PWA install
- advanced business-only tracks
- creator tooling for faster content authoring

---

## 7. Product positioning

### Compared with Duolingo
This app should be:
- less childish
- more phonologically serious
- more explicit about Mandarin-to-Cantonese transfer
- more practical for Hong Kong / Guangdong

### Compared with textbooks
This app should be:
- less academic
- more interactive
- more bite-sized
- more audio-first
- easier to review repeatedly

### Compared with phrasebooks
This app should be:
- more systematic
- better at building pronunciation
- more reusable
- more explicit about grammar differences

---

## 8. Language and script policy

### 8.1 Explanation language
- Explanations are in Chinese
- Default explanation script: Traditional Chinese
- Users can toggle the full UI and lesson text into Simplified Chinese
- English explanation mode is deferred to v2+

### 8.2 Global script toggle
Requirements:
- visible in the navbar at all times
- works across UI chrome and lesson content
- available immediately on landing
- highlighted during onboarding (“You can learn Traditional too”)
- has a keyboard shortcut
- does not require authors to duplicate every string manually

Recommended implementation:
- author core content in Traditional Chinese
- convert display text to Simplified in-browser through a conversion layer
- do not store separate duplicate copies unless needed for exceptional edge cases

### 8.3 Keyboard shortcut
Requirement:
- one hotkey to switch Traditional <-> Simplified
- only active when the focus is not in a text input

Recommended default:
- backquote / ` key, with tooltip in settings and onboarding

### 8.4 Script display policy in lessons
Primary lesson display:
- Traditional characters
- Jyutping
- Mandarin explanation / gloss in Chinese

When toggle is set to Simplified:
- all interface copy and lesson text display in Simplified
- underlying lesson IDs and canonical data remain unchanged

---

## 9. Pronunciation policy

### 9.1 Canonical sound target
Teach a single canonical, careful, broadcast-like Cantonese target:
- Guangzhou-oriented
- clean /n/ vs /l/
- no high falling tone category in the learner-facing tone model
- no variant clutter in beginner-facing content

### 9.2 Tone model
Use a learner-facing six-tone model.
Introduce checked-tone syllables as short stop-final syllables tied to the six-tone framework, but do not overwhelm beginners on day one.

### 9.3 Pronunciation pedagogy
Pronunciation instruction should include:
- Jyutping basics
- initials
- finals
- tones
- common Mandarin interference
- listening discrimination
- repeat machine shadowing
- minimal pairs
- syllable-level and word-level practice
- phrase-level rhythm

### 9.4 Strictness philosophy
Speaking feedback should be as strict as technically reasonable, but the app must not give false confidence.
Therefore:
- self-recording and A/B comparison are core
- automated scoring is optional and clearly labeled experimental
- automated scoring must never be required to pass curriculum content in v1
- automatic full marks should be rare, not generous

---

## 10. Audio policy

### 10.1 MVP audio
- use pre-generated static audio assets
- bundle them with the app
- no runtime dependence on browser TTS for production content
- provide normal speed, 0.75x, and 0.5x playback
- dialogue speaker identities remain consistent: one male voice, one female voice

### 10.2 Audio content types
Need audio for:
- individual syllables
- minimal pairs
- words
- short phrases
- dialogue turns
- dictation prompts
- tone drills
- quiz feedback cues (simple UI sounds optional)

### 10.3 Audio asset strategy
Each content item should reference stable asset IDs, not raw file paths embedded ad hoc in JSX.

Suggested pattern:
- `public/audio/voice-id/item-id@100.mp3`
- `public/audio/voice-id/item-id@75.mp3`
- `public/audio/voice-id/item-id@50.mp3`

### 10.4 TTS editorial rule
TTS is acceptable for MVP, but every shipped audio asset should be manually spot-checked.
If a pronunciation is wrong:
- override with SSML / pronunciation lexicon if available
- regenerate
- or replace with curated asset later

---

## 11. Pedagogical model

### 11.1 Learning model
The curriculum combines:
- phrase-first onboarding
- early phonology
- just-in-time grammar contrasts
- practical dialogues
- high-frequency vocabulary
- repeated listening
- rapid review
- simulated real-world reading

### 11.2 Lesson size
Each step should take about **30–60 seconds** of thinking and doing.
The experience should feel like:
- small wins
- very low friction
- clear momentum
- many repetitions

### 11.3 Section structure
Each section should include:
1. short introduction / scenario
2. lesson sequence of micro-steps
3. built-in review opportunities
4. end-of-section quiz
5. recommendation to repeat if below threshold
6. optional repeat machine / arcade reinforcement

### 11.4 Unlock policy
Nothing is locked.
The course is strongly recommended in order, but learners can skip ahead.

---

## 12. Narrative spine

Use a safe, practical narrative arc:

### A1
A Mandarin-speaking visitor from Singapore arrives in Hong Kong:
- survival phrases
- airport / arrival
- meeting friends
- hotel check-in
- getting around
- eating
- paying
- asking simple questions

### A2
The next day: business conference and urban daily life:
- registration
- networking
- scheduling
- taxis and transit
- lunches
- casual small talk
- messaging
- fixing simple problems

### B1–B2
Professional and social competence:
- product demos
- factory visits
- shipping / logistics
- arranging meetings
- clarifying misunderstandings
- customer / supplier interactions
- presentations
- follow-up communication

### C1–C2
High-speed professional fluency in safe domains:
- nuanced meetings
- negotiation framing
- trade-fair conversations
- professional hospitality
- spontaneous discussion
- persuasion
- long-form listening
- dense colloquial input

---

## 13. Curriculum architecture

The PRD should support a long-term A1–C2 roadmap, but the first implementation should ship a polished A1 slice.

### 13.1 Program-level structure
Suggested macro structure:

- **Phase 0: Start Here**
- **A1: Arrival and survival**
- **A2: Daily city + conference basics**
- **B1: Independent social and work interaction**
- **B2: Professional confidence**
- **C1: Fast colloquial professional Cantonese**
- **C2: High-speed business and relationship fluency**

### 13.2 Phase 0: Start Here
Purpose:
- immediately show value
- prove Mandarin gives a shortcut
- hook the learner
- explain script toggle
- teach a few survival phrases before technical phonology

Suggested contents:
- app intro
- Traditional/Simplified toggle tip
- “Why Cantonese is learnable if you know Mandarin”
- first survival phrases
- first 1–10 numbers
- first insight cards for core function words

### 13.3 A1 section map
Suggested A1 sections:

1. Start Here: survival phrases in 10 minutes  
2. Sound Lab 1: Jyutping, tones, initials, finals  
3. Meet and greet  
4. Airport / arrival / transport  
5. Hotel and check-in  
6. Food, drinks, and paying  
7. Asking where things are  
8. Reading Hong Kong in the wild  
9. Review and checkpoint A1

### 13.4 A2 section map
Suggested A2 sections:
1. Conference arrival
2. Registration and introductions
3. Scheduling and timing
4. Small talk over meals
5. Messaging and arranging meetups
6. Shopping and errands
7. Simple problem solving
8. Review and checkpoint A2

### 13.5 B1 section map
Suggested B1 sections:
1. Deeper listening to casual speech
2. Describing plans and experiences
3. Product and service conversations
4. Directions, logistics, and coordination
5. Reading signs, menus, notices, and chat
6. Review and checkpoint B1

### 13.6 B2 section map
Suggested B2 sections:
1. Meetings and agendas
2. Clarifying details
3. Presenting and explaining
4. Handling customer-facing interactions
5. Negotiation basics in safe business settings
6. Review and checkpoint B2

### 13.7 C1–C2 section map
Suggested higher-level sections:
- high-speed listening
- dense colloquial dialogue
- advanced sentence-final particles
- persuasion and nuance
- relationship management
- conference floor and trade-fair interaction
- long-form review and scenario simulation

---

## 14. The first 10 minutes

The first 10 minutes must be exceptionally insight-dense.

### 14.1 Goals of the first 10 minutes
The learner should leave thinking:
- “I already understand some of this.”
- “The script toggle makes this approachable.”
- “These function words map to Mandarin in a useful way.”
- “I can say a few things already.”
- “I want to continue.”

### 14.2 Required content in the first 10 minutes
Include:
- onboarding banner pointing to script toggle
- 3–5 survival phrases
- numbers 1–10
- at least 5 high-value Cantonese function-word mappings
- at least one short listen-repeat interaction
- at least one character tooltip interaction
- at least one extremely short dialogue

### 14.3 Candidate first insight set
Strong early mappings:
- 係 = 是
- 喺 = 在
- 嘅 = 的
- 冇 = 沒有
- 佢 = 他 / 她 / 它
- 唔 = 不 / 沒 (depending on context)
- 咗 = 了

These should not be taught as abstract grammar first; they should be introduced through meaningful examples.

### 14.4 Candidate first phrases
Examples:
- 你好
- 唔該
- 多謝
- 洗手間喺邊度？
- 我想去……
- 呢個幾多錢？
- 可以幫下我嗎？ (or colloquial equivalent preferred by editorial style guide)

Editorial note:
content writers should keep phrases short, useful, and reusable.

---

## 15. Grammar contrast strategy

Only explain grammar when Cantonese meaningfully departs from Mandarin or when Mandarin transfer causes mistakes.

### 15.1 Grammar explanation style
Grammar notes should be:
- short
- contrastive
- example-first
- low-jargon
- immediately useful

Preferred template:
- “普通話常見說法：…”
- “粵語更自然會說：…”
- “先記住這個用法，不用背術語。”

### 15.2 High-priority contrast micro-lessons
These are content targets for authoring. They should be validated against the editorial reference before large-scale production.

1. 係 as copula (“是”)  
2. 喺 as locative / existential location marker (“在”)  
3. 嘅 as high-frequency modifier / possession marker (“的”)  
4. 冇 as “沒有 / 沒”  
5. 唔 as general negator  
6. 未 as “not yet” pattern  
7. 咗 as perfective / changed-state marker  
8. 緊 as progressive marker  
9. 住 as durative / ongoing-state marker  
10. 過 as experiential marker  
11. 佢 / 你哋 / 我哋 and pronoun system differences  
12. 哋 as plural marker for pronouns  
13. 啲 as “some / these / plural-ish” function word  
14. 有冇 as high-frequency question frame  
15. 係唔係 as yes/no frame  
16. 邊度 / 點樣 / 幾時 / 點解 / 邊個 question words in real colloquial use  
17. Sentence-final particles in beginner use: 呀 / 啦 / 喇 / 呢 / 㗎 / 啫 / 嘛 / 喎  
18. 咩 / 乜 for “what” in colloquial contexts  
19. 同 as common “with / and” connector  
20. 畀 as give / for / let / passive-like functions in high-frequency patterns  
21. 先 as sequencing / “first” / “before that” pragmatic marker  
22. 添 as “also / additionally / one more”  
23. 晒 as “all / completely” result marker  
24. 返 as “back / return” in action chains  
25. 呢個 / 嗰個 / 呢啲 / 嗰啲 demonstrative patterns  
26. Common colloquial question endings instead of overusing 嗎  
27. Common request softeners (e.g. 下)  
28. Common changed-state expressions with adjectives + 咗  
29. Common resultative / directional compounds in daily speech  
30. Frequent Mandarin lookalikes that behave differently in Cantonese

### 15.3 Editorial rule for grammar
A learner should almost never encounter a “grammar wall of text.”
Every grammar point must be attached to:
- a scenario
- a phrase
- a dialogue
- or a listening task

---

## 16. Character strategy

### 16.1 Character policy
Teach reading and recognition, not handwriting.

### 16.2 Traditional-first policy
Everything is authored Traditional-first.
The Simplified view is a display transformation layer.

### 16.3 Cantonese-specific character strategy
Introduce roughly the high-value Cantonese-specific character inventory just in time.
Do not front-load a giant character list.

### 16.4 Tooltip / glossary behavior
Any character or word that is:
- Cantonese-specific
- newly introduced
- easy to confuse
should support hover / tap glossary behavior.

Tooltip should show:
- Traditional
- Simplified
- Jyutping
- Mandarin gloss / explanation
- short usage note if needed
- audio play button

### 16.5 Reading targets
The learner should be trained to read:
- menus
- shop signs
- prices
- floor / exit markers
- transit terms
- convenience-store style notices
- cashier prompts
- common service interactions
- simple chat-style writing

---

## 17. Jyutping strategy

### 17.1 Why Jyutping matters
Jyutping is central because the learner needs:
- a consistent pronunciation map
- a way to think about sounds accurately
- a bridge from hearing to saying
- a way to type limited answers without OS-level input

### 17.2 Jyutping teaching policy
Teach Jyutping early, but not as abstract chart memorization only.
It must appear through:
- audio
- phrases
- syllable drills
- tone drills
- autocomplete-based input
- minimal pair practice

### 17.3 Input policy
When text input is required, the learner types Jyutping directly with tone numbers:
- `syut1`
- `nei5 hou2`
- `go2 go3`

The app should:
- avoid text input in most exercises
- support text input mainly in sound-focused drills
- never require OS keyboard setup

### 17.4 Smart autocomplete
Desired interaction:
- learner types valid Jyutping syllable + tone
- once a complete token is recognized, the UI suggests matching character(s) / word(s)
- support chaining multiple complete tokens separated by spaces
- where possible, show phrase suggestions for known multi-token sequences

Example:
- user types `nei5 hou2`
- app can suggest `你好`

---

## 18. Exercise library

The course should support multiple exercise types from a single lesson renderer.

### 18.1 Core exercise types
1. **Tap to reveal / learn card**  
2. **Listen and choose**  
3. **Listen and match audio to text**  
4. **Choose the correct Jyutping**  
5. **Choose the correct tone number**  
6. **Minimal pair discrimination**  
7. **Reorder dialogue tiles**  
8. **Fill blank from word bank**  
9. **Quick phrase comprehension**  
10. **Simulated signage reading**  
11. **Repeat machine**  
12. **Self-rating speaking step**  
13. **Jyutping input with autocomplete**  
14. **Micro-dictation from limited choices**  
15. **Section quiz item**

### 18.2 Recognition-first rules
Prefer:
- taps
- choices
- ordering
- matching
- audio identification
- low-friction input

Use production lightly:
- Jyutping typing
- speech recording
- optional self-marking

### 18.3 Feedback philosophy
Feedback must be:
- immediate
- brief
- clear
- non-patronizing
- specific about why an answer is wrong when possible

---

## 19. Repeat machine

### 19.1 Definition
A repeat machine is a pronunciation practice tool where:
1. the app plays a target phrase
2. the learner records themselves repeating it
3. the learner can play back the original and their own recording
4. the learner can A/B loop them to hear the difference

### 19.2 Why it matters
This is a core differentiator.
It gives tight feedback loops without a backend.
It is especially valuable for Mandarin speakers because many errors are perceptual until heard side by side.

### 19.3 Repeat machine v1 requirements
Must support:
- play target audio
- record microphone input
- play learner recording
- replay target
- A/B compare
- loop mode
- 1.0 / 0.75 / 0.5 target speed
- self-rating (“不好 / 還行 / 很準” or equivalent)
- mark for review later

### 19.4 Repeat machine v2+ ideas
Future enhancements:
- syllable segmentation
- tone contour overlay
- pitch contour estimation for isolated syllables
- experimental local scoring
- streak mode
- rapid-fire character-to-pronunciation drills

---

## 20. Arcade mode

Arcade mode is separate from the main curriculum.
It exists to make repetition fun and fast.

### 20.1 v1 arcade candidates
1. **Tone Sprint**  
   Hear a syllable or see a tone contour and choose the tone.

2. **Char Flash**  
   See a character / word, recall pronunciation, then reveal / record / self-mark.

3. **Sign Snap**  
   Read common Hong Kong-style public text quickly.

4. **Minimal Pair Blitz**  
   Distinguish similar initials, finals, or tones under time pressure.

### 20.2 Stretch goal
A very fast flashcard-like experience approaching “100 characters per minute” for high-frequency recognition and speaking verification.

### 20.3 Tracking
Track separately from curriculum completion:
- best streak
- fastest clear
- last played
- aggregate correct rate

---

## 21. Content architecture

### 21.1 Authoring model
Use a structured, content-driven system so lessons can scale without rewriting UI code.

Recommended content sources:
- JSON (or YAML) manifests for structure
- Markdown strings for explanation blocks if needed
- Zod validation at build time

### 21.2 Content objects
Recommended object types:
- course
- section
- lesson
- step
- lexicon entry
- character / word glossary entry
- audio asset metadata
- quiz
- arcade config

### 21.3 Lesson object (suggested)
Fields:
- `id`
- `courseId`
- `sectionId`
- `titleTrad`
- `titleZhHansOverride?`
- `descriptionTrad`
- `estimatedMinutes`
- `prerequisiteIds[]` (informational only, not locked)
- `tags[]`
- `steps[]`
- `reviewItemIds[]`

### 21.4 Step object (suggested)
Fields:
- `id`
- `type`
- `promptTrad`
- `bodyTrad?`
- `displayMode` (`characters`, `jyutping`, `both`, `audio-first`, etc.)
- `audioId?`
- `choices?`
- `correctAnswer`
- `explanationTrad?`
- `glossaryRefs[]`
- `metadata` for type-specific options

### 21.5 Lexicon entry (suggested)
Fields:
- `id`
- `trad`
- `simpOverride?`
- `jyutping`
- `mandarinGlossZh`
- `partOfSpeech`
- `tags[]`
- `audioIds`
- `exampleIds[]`
- `notesTrad?`

### 21.6 Dialogue turn (suggested)
Fields:
- `speaker` (`male`, `female`)
- `textTrad`
- `jyutping?`
- `mandarinGlossZh?`
- `audioId`
- `teachingNotes?`

### 21.7 Audio manifest
Fields:
- `id`
- `voice`
- `path100`
- `path75`
- `path50`
- `durationMs`
- `textTrad`
- `jyutping?`
- `kind` (`syllable`, `word`, `phrase`, `dialogue`, `quiz`)

---

## 22. UI / UX requirements

### 22.1 Visual style
Target tone:
- calm
- crisp
- text-forward
- modern
- not cute in a childish way
- enough warmth to feel inviting

### 22.2 Layout priorities
Prioritize:
- clear hierarchy
- low clutter
- strong readability
- keyboard accessibility
- fast step transitions
- strong contrast
- dark mode

### 22.3 Essential screens
1. Landing page  
2. Curriculum map  
3. Lesson player  
4. Section overview  
5. Quiz result screen  
6. Review screen  
7. Arcade screen  
8. Settings screen  
9. Progress import/export/reset modal

### 22.4 Landing page
Must communicate:
- who it is for
- why Mandarin speakers will move fast
- script toggle
- course shape
- start now CTA

### 22.5 Curriculum map
Should look like a freeCodeCamp-style path:
- linear sections
- visible hierarchy
- each section expandable
- completion indicators
- unlocked by default
- current position obvious

### 22.6 Lesson player
Must support:
- micro-step progression
- audio controls
- glossary hover/tap
- immediate feedback
- keyboard navigation where sensible
- persistent “script toggle” in nav
- persistent progress save

### 22.7 Character tooltip
Important component.
On hover/tap of eligible text:
- show gloss
- show Jyutping
- show quick audio play
- never block reading flow excessively

---

## 23. Accessibility requirements

Must include:
- semantic HTML
- keyboard navigability
- screen-reader labels
- visible focus states
- adequate contrast
- reduced-motion respect
- captions / transcript text for audio content
- color not used as sole signal
- buttons large enough on mobile
- dark mode support

Speech / audio UI must:
- clearly indicate recording state
- allow non-audio fallback learning path
- not autoplay unexpectedly without user action
- be usable without mouse

---

## 24. Technical architecture

### 24.1 Required stack
- React
- TypeScript
- Vite
- React Router
- local static assets
- GitHub Actions for build/deploy
- GitHub Pages-compatible output

### 24.2 State strategy
Recommended split:
- app settings state
- progress state
- lesson session state
- content data (static)
- audio playback state
- recording state

Local storage is the system of record for user progress.

### 24.3 Storage policy
Store:
- completed lesson IDs
- completed section quiz scores
- settings (script preference, dark mode, playback speed preference)
- review flags
- arcade stats
- optional self-rating history if lightweight

Do not store:
- cloud data
- personally identifying info
- uploaded audio long term beyond local in-session unless explicitly chosen later

### 24.4 Import / export
The settings page must allow:
- export progress as JSON
- import progress JSON
- reset all local progress with confirmation

### 24.5 Router structure (suggested)
- `/`
- `/learn`
- `/section/:sectionId`
- `/lesson/:lessonId`
- `/quiz/:quizId`
- `/review`
- `/arcade`
- `/settings`

### 24.6 Deployment
Must produce a purely static build suitable for GitHub Pages.

---

## 25. Performance requirements

### 25.1 Load performance
The app should:
- load quickly on first visit
- lazy-load lesson content by section
- lazy-load non-critical code
- avoid unnecessary heavy dependencies
- keep bundle sizes disciplined

### 25.2 Asset loading
- audio should load on demand
- prefetch likely next-step audio where helpful
- avoid eager-loading the whole course
- keep UI responsive during audio and recording interactions

### 25.3 China-friendly deployment posture
- no external fonts
- no blocked CDN dependency at runtime
- no YouTube / western embed dependency
- no analytics scripts required for core function
- no remote API needed for lesson play

---

## 26. Static-audio build pipeline

### 26.1 Requirement
Production content must use bundled static audio assets.

### 26.2 Recommended workflow
1. Author content with stable text/audio IDs  
2. Run audio generation script outside the browser  
3. Review generated files  
4. Commit or attach assets to build  
5. App references manifest only

### 26.3 Voice rule
Use consistent voice assignment:
- male voice for one recurring speaker
- female voice for one recurring speaker

### 26.4 Missing-audio behavior
If an asset is missing:
- show a clear fallback UI
- do not crash the lesson
- mark the item for editorial fix
- optionally disable the affected step gracefully

---

## 27. Experimental speech scoring strategy

### 27.1 v1 rule
Core curriculum must not depend on automatic speech scoring.

### 27.2 Why
Without a backend, scoring reliability will vary across devices and browsers.
False confidence is worse than no score.

### 27.3 Optional experimental path
If implemented later:
- feature-flagged
- syllable-level only at first
- only for dedicated pronunciation drills
- outputs “likely close / check again,” not authoritative grading
- never blocks curriculum completion

---

## 28. Content safety and editorial rules

### 28.1 Allowed scenario domains
- airport
- train / MTR
- taxi
- hotel
- restaurant
- cafe
- convenience store
- shopping
- payment
- asking directions
- friendship
- conference registration
- networking
- scheduling
- supplier / customer logistics
- product demo
- trade show
- invoice / payment follow-up
- shipping / delivery
- presentation setup

### 28.2 Forbidden domains
- politics
- elections
- ideology
- public controversy
- censorship discussion
- protests
- police conflict
- military
- religion
- ethnic conflict
- sexual content beyond mundane courtesy
- profanity-centered lessons
- historical debates

### 28.3 Writing tone
Keep dialogue:
- polite
- light
- practical
- urban
- natural
- censorship-safe
- adult

---

## 29. Section quiz strategy

### 29.1 Purpose
Quizzes are advisory, not gatekeeping.
They help learners decide whether to review.

### 29.2 Quiz composition
Mix:
- listening recognition
- vocabulary recognition
- grammar contrast recognition
- reading recognition
- light production
- optionally one speaking self-check

### 29.3 Result policy
If score below threshold:
- recommend repeating targeted lessons
- do not lock next section

Suggested threshold:
- 80% recommended mastery line

---

## 30. Review system

### 30.1 v1 review
Keep it simple:
- flag step / word / phrase as “review later”
- section quiz can surface weak areas
- optional daily review page from flagged items

### 30.2 v2+ review
Future spaced repetition:
- decay-based scheduling
- tone confusion prioritization
- pronunciation replay queue
- signage reading queue

---

## 31. Initial A1 implementation depth

The product architecture supports A1–C2, but the first build should ship a polished A1 slice.

### 31.1 First build minimum content target
Ship enough content to prove:
- onboarding works
- the script toggle works
- the lesson player works
- audio works
- glossary works
- repeat machine works
- quiz works
- progress works
- the curriculum can scale

### 31.2 Suggested first-build content slice
At minimum:
- Start Here section
- Sound Lab 1 section
- Meet & Greet section
- one quiz
- one arcade prototype

### 31.3 Suggested sample lessons in first build
1. Welcome + script toggle  
2. First survival phrases  
3. Numbers 1–10  
4. Five big Cantonese function words  
5. Tones overview  
6. Tone drill with one syllable  
7. Core initials and finals  
8. 你好 / 唔該 / 多謝 in context  
9. Asking where the bathroom is  
10. Simple mini-dialogue at hotel or station  
11. Review  
12. A1 checkpoint quiz

---

## 32. Acceptance criteria for the first production-worthy milestone

The milestone is successful if:

### Product
- static deployment works on GitHub Pages
- no backend is required for lesson flow
- no external runtime dependency is required for core functionality

### UX
- landing page explains the concept clearly
- curriculum map is readable and motivating
- lesson player supports multiple step types
- dark mode works
- script toggle works from any screen
- keyboard shortcut works outside text inputs

### Learning
- at least one polished A1 path is usable end to end
- at least one quiz exists
- at least one repeat-machine flow exists
- at least one glossary-enabled Cantonese-specific character interaction exists

### Persistence
- progress survives refresh
- export/import/reset works

### Audio
- bundled audio plays correctly at 1.0 / 0.75 / 0.5
- missing assets fail gracefully

### Accessibility
- keyboard navigation works for major flows
- ARIA labels and visible focus states are present
- no major color-contrast issues

---

## 33. Risks and mitigations

### Risk 1: Audio quality feels wrong
Mitigation:
- treat audio generation as an editorial pipeline, not an afterthought
- maintain a pronunciation exception list
- spot-check all shipped items

### Risk 2: The course becomes a giant skeleton
Mitigation:
- ship a polished A1 slice first
- keep content schema reusable
- prioritize depth where the learner first touches the app

### Risk 3: Too much text explanation
Mitigation:
- cap explanation block length
- prefer examples, audio, and micro-contrasts
- explain only where Cantonese differs meaningfully from Mandarin

### Risk 4: Variant debates bloat the product
Mitigation:
- enforce one-standard editorial rule
- one canonical answer per exercise
- no public variant lecture in v1

### Risk 5: Static app overreaches on speech scoring
Mitigation:
- make repeat machine core
- keep speech scoring optional and experimental
- do not use scoring for progression

---

## 34. Implementation notes

The PRD assumes:
- a static-deployment-friendly frontend stack
- browser-side Traditional/Simplified conversion
- bundled static audio assets
- optional-only speech scoring in early versions

These assumptions are meant to keep the product fast, portable, censorship-aware, and feasible on GitHub Pages.

---

## 35. Final build decision summary

Locked decisions:
- Chinese-first product
- Traditional-first authoring
- global Traditional/Simplified toggle
- one canonical Standard Cantonese target
- spoken colloquial Cantonese focus
- recognition-first learning design
- pre-generated bundled audio
- no backend
- no accounts
- no lock gates
- section quizzes advisory only
- architecture broad enough for A1–C2
- first implementation deep enough for a polished A1 slice

This PRD is the source of truth for the first Codex implementation prompt.