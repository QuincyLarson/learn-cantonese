# PRD: Standard Cantonese for Mandarin Speakers
## Static, linear web curriculum for Guangzhou-oriented colloquial Cantonese

Version: 1.0  
Status: Approved for initial build planning  
Primary implementation target: React + TypeScript + Vite + GitHub Pages  
Primary market for v1: Mandarin-speaking adults who want to function in Hong Kong and Guangdong

---

## 1. Product summary

Build a static web app that helps Mandarin speakers learn **standardized, Guangzhou-oriented colloquial Cantonese** through one linear curriculum:

1. **Chapter 1: Learn Cantonese pronunciation through Jyutping**
2. **Chapter 2: Learn the characters, words, and grammatical patterns that differ from Mandarin**
3. **Endless practice mode** for long-term spaced repetition and refinement from A1 through C2

The product is built around one key insight: Mandarin speakers already know most of the meanings, characters, and discourse structure they need for advanced Cantonese. The shortest path is therefore:
- teach the Cantonese sound system correctly through Jyutping
- fix the highest-frequency Cantonese-specific vocabulary and grammar interference points
- spend most total learning hours in high-volume practice, not slow explanation

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
- Jyutping-first pronunciation onboarding
- early tone stabilization
- only the initials and finals that differ materially from pinyin
- Mandarin-interference repair through short sentences
- high-frequency Cantonese-specific characters and function words
- repeated listening
- read-aloud comparison labs
- rapid review
- endless practice at increasing scale and speed

### 11.2 Lesson size
Each step should take about **30–60 seconds** of thinking and doing.
The experience should feel like:
- small wins
- very low friction
- clear momentum
- many repetitions

### 11.3 Section structure
Each section should include:
1. one tiny target contrast or sentence pattern
2. hear the target audio and see the Jyutping
3. type the Jyutping
4. read it aloud and compare with the target
5. built-in review opportunities
6. handoff into longer practice

### 11.4 Unlock policy
Nothing is locked.
The course is strongly recommended in order, but learners can skip ahead.

---

## 12. Narrative spine

Use a curriculum arc, not a travel-story arc:

### Chapter 1
The learner rebuilds pronunciation through Jyutping:
- six tones with one fixed syllable
- initials that differ from pinyin
- finals that differ from pinyin
- early typing labs
- early read-aloud comparison labs

### Chapter 2
The learner repairs Mandarin interference through Cantonese-specific material:
- high-frequency Cantonese-only characters
- colloquial verbs that replace Mandarin-like choices
- function words and particles in short sentences
- sentence patterns that are guessable from context
- pragmatic usage that sounds natural in Hong Kong / Guangdong

### Endless practice
The learner spends most total hours in long-form repetition:
- word typing
- sentence typing
- listening replay
- backlog review
- progressively denser and faster input from A1 through C2

---

## 13. Curriculum architecture

The PRD should support a long-term A1–C2 roadmap, but the first implementation should ship a polished A1 slice.

### 13.1 Program-level structure
The long-term A1–C2 roadmap should be delivered through three product layers, not many disconnected tracks:

1. **Chapter 1: Pronunciation through Jyutping**
2. **Chapter 2: Cantonese-specific characters, vocabulary, and grammar patterns**
3. **Endless practice mode** that keeps reviewing the same knowledge at increasing scale and speed

CEFR labels still matter for internal curriculum planning, but the learner-facing structure should stay simple and linear.

### 13.2 Chapter 1: Pronunciation through Jyutping
Purpose:
- establish Jyutping as the only phonetic system from the start
- stop learners from mapping Cantonese onto pinyin habits
- teach the six tones early with one fixed initial-final combination
- teach only the initials and finals that differ materially from pinyin before expanding outward

Core lesson pattern:
1. Hear one sound contrast
2. See the Jyutping
3. Type the Jyutping
4. Read it aloud
5. Compare with the target audio

Chapter 1 should include:
- a simple animated tone visual showing all six tone contours
- one fixed syllable used to teach all six tones before changing segmental material
- the shortest path through initials and finals that are different from pinyin
- early labs for Jyutping typing and read-aloud repetition

### 13.3 Chapter 2: Characters and patterns different from Mandarin
Purpose:
- target the highest-value Cantonese-specific material first
- exploit the learner's existing Mandarin literacy instead of reteaching meanings
- focus on what actually causes misunderstanding or outsider-like phrasing in Hong Kong / Guangdong

Chapter 2 should include:
- high-frequency Cantonese-specific characters
- common colloquial verbs and function words that are not Mandarin-like
- grammatical patterns that diverge sharply from Mandarin usage
- short sentences where the meaning is guessable from context
- inline Mandarin explanations only for the Cantonese-specific item, not for the whole sentence

### 13.4 Endless practice mode
Purpose:
- hold the learner inside high-volume repetition for the majority of total hours
- cover 5,000 common characters and high-frequency Cantonese structures
- keep growing from A1 into C2 without changing the core interaction model

Endless mode should include:
- single-word and phrase Jyutping typing
- short-sentence Jyutping typing
- spaced repetition scheduling
- replay, reveal, and self-correction loops
- later expansion into faster listening, denser vocabulary, and professional colloquial input

### 13.5 A1–C2 progression inside the linear model
The linear model should still map to CEFR-like depth:

- **A1–A2**: core Jyutping system, tone stability, highest-frequency Cantonese-only words and sentence frames
- **B1–B2**: faster everyday listening, wider colloquial vocabulary, stronger control of particles and spoken syntax
- **C1–C2**: high-speed colloquial comprehension, dense vocabulary, professional register, and sustained fluency under real-world speed

### 13.6 500-book production plan
The long-term production target is **500 books** across the three learner-facing layers.

For planning purposes, a **book** means one compact curriculum packet with:
- one clear teaching objective
- one line of learner-facing summary copy
- roughly 8 to 20 cards or drills
- stable ids
- glossary support for Cantonese-specific items
- bundled or placeholder audio ids

The final 500-book split should be:
- **Unit 1 / Chapter 1 pronunciation**: 120 books
- **Unit 2 / Chapter 2 Cantonese grammar and usage**: 180 books
- **Endless practice**: 200 books

### 13.7 Staged delivery targets
Future agents should expand the curriculum in stages, always preserving the single linear learner view.

#### Stage A: Foundation to 40 books
Target:
- Unit 1: 12 books
- Unit 2: 18 books
- Endless practice: 10 books

Purpose:
- make the first serious production slice feel complete
- cover the full tone system and the first pinyin-different initials/finals
- cover the highest-frequency Cantonese-only words, particles, and verb swaps
- establish the first stable endless-practice loops

#### Stage B: Core A1–A2 to 120 books
Target:
- Unit 1: 30 books
- Unit 2: 45 books
- Endless practice: 45 books

Purpose:
- finish the full Jyutping onboarding path for Mandarin speakers
- cover the highest-value daily-life Cantonese-specific sentence patterns
- make endless mode broad enough that learners can stay in it for real review

#### Stage C: Working fluency to 250 books
Target:
- Unit 1: 60 books
- Unit 2: 90 books
- Endless practice: 100 books

Purpose:
- reach strong B1–B2 learner coverage
- broaden listening, particle control, colloquial syntax, and Hong Kong usage clusters
- deepen the review pool enough that learners stop looping only through beginner content

#### Stage D: Advanced colloquial range to 380 books
Target:
- Unit 1: 90 books
- Unit 2: 130 books
- Endless practice: 160 books

Purpose:
- cover dense colloquial input, style/register shifts, and workplace/service interaction
- prepare the transition from operational fluency to advanced nuance

#### Stage E: Full catalog to 500 books
Target:
- Unit 1: 120 books
- Unit 2: 180 books
- Endless practice: 200 books

Purpose:
- complete the C1–C2 path
- make the curriculum feel exhaustive for Mandarin-speaking adult learners
- support years of continued refinement without changing the app model

### 13.8 Book production order inside each unit
Future agents should prioritize content in this order.

#### Unit 1 order
1. Six tones with one fixed syllable
2. Pinyin-different initials
3. Pinyin-different finals
4. High-confusion minimal pairs
5. Tone discrimination labs
6. Read-aloud comparison labs
7. Combined initial-final-tone mastery packs

#### Unit 2 order
1. Cantonese-only function words and particles
2. High-frequency character swaps from Mandarin-like to Cantonese-like usage
3. Common colloquial verbs and complements
4. Sentence patterns that differ sharply from Mandarin
5. Hong Kong daily-life clusters: transport, restaurants, office, shopping, service talk
6. Higher-level discourse particles, register, and local media-style phrasing

#### Endless practice order
1. High-frequency single-character Jyutping packs
2. Common two-character and short phrase packs
3. Short-sentence typing packs
4. Listening-heavy review packs
5. Advanced nuance, rate, and register refinement packs

### 13.9 Agent execution rules for future curriculum expansion
Any future agent expanding the catalog should follow these rules:

1. Add books in batches of roughly 8 to 20 at a time, not one isolated card.
2. Keep each book centered on one Mandarin-speaker confusion point or one tightly related cluster.
3. Update the curriculum counts in the app when adding books so the learner-facing totals stay truthful.
4. Keep learner-facing summaries to one line each.
5. Prefer colloquial Hong Kong / Guangdong usage over literal Mandarin translations.
6. Do not add backend requirements, server scoring dependencies, or non-static content systems.
7. When adding advanced material, preserve the same interaction model instead of inventing a second product.

### 13.10 Definition of done for each stage
A stage is only complete when:
- the target book counts for each unit are met
- each new book has stable ids and audio placeholders or assets
- the curriculum page shows the correct built-versus-planned counts
- the content remains Mandarin-speaker-first and contrastive
- the full static build still works on GitHub Pages

---

## 14. The first 10 minutes

The first 10 minutes must be exceptionally insight-dense.

### 14.1 Goals of the first 10 minutes
The learner should leave thinking:
- “Jyutping is enough. I don’t need another phonetic crutch.”
- “The tone numbers are learnable.”
- “I can actually hear that the same segment changes meaning by tone.”
- “The parts that differ from Mandarin are finite and teachable.”
- “I want to keep going.”

### 14.2 Required content in the first 10 minutes
Include:
- onboarding banner pointing to script toggle
- one fixed-syllable six-tone visual
- at least one listen-and-repeat interaction using Jyutping only
- at least one type-the-Jyutping interaction
- the first pinyin-different initials and finals
- at least one Cantonese-specific character tooltip inside a short sentence

### 14.3 Candidate first insight set
Strong early insights:
- `si1` to `si6` can be the same segment with six different tones
- Jyutping `j` is not pinyin `j`; it is closer to English `y`
- `gw / kw` must keep the `w`
- `ng` can appear at the start of a syllable
- `aa` and `a` should not be collapsed
- `n / l` must stay separate in the canonical target

These should be taught through audio + typing + immediate contrast, not through long explanation.

### 14.4 Candidate first sentence targets
Examples:
- 呢個係咩？
- 佢喺邊度？
- 我而家返工。
- 呢啲嘢好啱用。
- 你哋今日嚟唔嚟？

Editorial note:
the first sentence targets should exist mainly to anchor pronunciation, Jyutping, and the first Cantonese-specific items, not to dump survival phrase lists.

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
Technology exists for cloud-based Cantonese speech recognition and limited pronunciation assessment, but reliable verification of **initial + final + tone** at curriculum-gating quality is not realistic for a static-only GitHub Pages product today.

If implemented later:
- feature-flagged
- optional online service, never required for the static core product
- dedicated to Chapter 1 pronunciation labs first
- outputs “likely close / check again,” not authoritative grading
- may score initial, final, and tone separately only when confidence is high enough
- never blocks curriculum completion

### 27.4 Early-course pronunciation lab rule
Because pronunciation matters early, Chapter 1 should still require:
- target audio playback
- learner recording
- replay of learner audio
- replay of target audio
- self-rating and retry

This gives meaningful pronunciation training without pretending the score is authoritative.

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
- the new linear curriculum entry works
- Chapter 1 pronunciation teaching works
- Chapter 2 Mandarin-interference teaching works
- endless practice mode works
- the script toggle works
- audio works
- glossary works
- progress works
- the curriculum can scale to A1–C2

### 31.2 Suggested first-build content slice
At minimum:
- one curriculum home page with three chapter entries
- Chapter 1 tone visual plus first pronunciation lessons
- Chapter 2 short-sentence lessons focused on Cantonese-specific items
- endless word typing mode
- one early pronunciation lab pattern
- one short-sentence lesson cluster with inline glossary help

### 31.3 Suggested sample lessons in first build
1. Why Jyutping comes first for Mandarin speakers  
2. Six tones with one fixed syllable  
3. First initials that differ from pinyin  
4. First finals that differ from pinyin  
5. Type-the-Jyutping lab  
6. Read-aloud comparison lab  
7. High-frequency Cantonese-only characters in short sentences  
8. Colloquial verbs that replace Mandarin-like choices  
9. Core particles and completion markers in context  
10. Short-sentence typing drill  
11. Chapter 2 review cluster  
12. Endless practice handoff

---

## 32. Acceptance criteria for the first production-worthy milestone

The milestone is successful if:

### Product
- static deployment works on GitHub Pages
- no backend is required for lesson flow
- no external runtime dependency is required for core functionality

### UX
- landing page explains the three-part curriculum clearly
- Chapter 1 makes the tone system visually legible
- Chapter 2 is clearly about Mandarin-vs-Cantonese differences
- endless practice is reachable as a long-term mode
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

---

## 36. Immediate execution priorities after foundation

The platform foundation now exists, but the next work must focus on **curriculum depth** instead of more scaffolding.

Future agents should treat the following as the active execution order.

### 36.1 Priority 1: Turn Chapter 1 into a real pronunciation course

Chapter 1 must stop being an overview page and become a real ordered lesson sequence with drills.

What still needs to be true:
- every high-value pronunciation contrast has a learner-facing lesson
- each lesson has a few high-frequency example characters or words
- each lesson ends in immediate action, not just explanation
- the learner repeatedly types Jyutping and hears correct audio
- read-aloud / repeat-machine practice becomes a first-class part of the chapter

Required lesson coverage for the first serious pass:
- six tones with one fixed syllable
- n / l
- z / c / s
- j as a separate Cantonese sound
- gw / kw
- ng vs zero onset
- aa vs a
- oe / eoi / yu
- stop-final syllables with p / t / k
- minimal-pair tone review
- mixed review
- transition from single words into short phrases

Execution rule:
- build these as real lessons with actual drills before expanding decorative overview text

Definition of done for this priority:
- Chapter 1 contains a visible ordered lesson sequence
- learners can complete real typing drills inside Chapter 1
- the chapter no longer depends on one generic explanation page

### 36.2 Priority 2: Make Chapter 2 systematically target Mandarin interference

Chapter 2 should be written like a Hong Kong teacher helping Mandarin speakers stop sounding like they are translating.

Future work should prioritize:
- Cantonese-only function words
- common colloquial verbs and nouns that replace Mandarin-like choices
- sentence patterns where Mandarin learners reliably over-transfer
- high-frequency Hong Kong everyday language

Mandatory high-frequency targets include:
- 係 / 喺
- 冇 / 唔
- 咗
- 呢 / 嗰 / 啲
- 佢 / 哋
- 嘅 / 咩 / 嚟 / 喎 / 啫 / 囉
- 而家 / 返工 / 收工 / 返屋企 / 鎖匙 / 荷包 / 雪櫃 / 𨋢 / 埋單 / 走冰 / 行街 / 吹水

Execution rule:
- every new Chapter 2 lesson must be justified by likely Mandarin-speaker confusion, not by abstract grammar coverage

Definition of done for this priority:
- Chapter 2 has broad cluster coverage for daily life, service interactions, office small talk, shopping, food, and transport
- the learner can infer sentence meaning from context while focusing on the Cantonese-specific item

### 36.3 Priority 3: Replace generic Chinese frequency with Cantonese-native frequency

The current 5k / 10k vocabulary base is useful but not yet a true Cantonese-native frequency deck.

This must eventually be replaced or corrected using a Cantonese-oriented corpus so that:
- endless mode reflects actual Cantonese frequency
- Cantonese-specific high-frequency characters are guaranteed coverage
- the long-tail C1 / C2 path is not distorted by Mandarin-heavy frequency artifacts

Execution rule:
- do not claim full Cantonese frequency coverage until the source corpus is actually Cantonese-native

Definition of done for this priority:
- the 5k character layer and 10k structure layer are derived from or corrected against Cantonese usage data
- Cantonese-specific items are tagged explicitly and coverage can be measured

### 36.4 Priority 4: Make the 500-book catalog honest

The current 500-book structure is a useful production scaffold, but many entries are still generated shells that hand off into shared practice surfaces.

Future agents must:
- convert planned or generic books into real content packets
- reduce or remove misleading production claims if the content is not yet real
- keep book summaries short and one-line
- preserve linearity for the learner

Execution rule:
- either materialize a book into real lesson content or clearly treat it as planned work

Definition of done for this priority:
- the curriculum page reflects genuine built content, not inflated counts

### 36.5 Priority 5: Strengthen read-aloud labs

Typing is core, but pronunciation training also needs strong ear-mouth feedback loops.

Future agents should expand:
- repeat machine inside Chapter 1
- target audio -> learner recording -> replay target -> replay learner
- explicit self-rating
- later optional speech assessment integration

Important constraint:
- any automated scoring must stay optional and must never gate progression in the static core product

Definition of done for this priority:
- early Chapter 1 lessons visibly include read-aloud comparison work, not only typing

### 36.6 Priority 6: Produce curated bundled audio

Browser speech is acceptable for prototype support, but the production target remains bundled audio.

Future agents should:
- replace fallback-only flows in core lessons with curated static audio assets
- keep one consistent male and one consistent female speaker identity
- spot-check every shipped asset

Definition of done for this priority:
- core lessons in Chapter 1 and Chapter 2 do not depend on runtime browser TTS for their main instructional audio

### 36.7 Priority 7: QA, accessibility, and performance cleanup

The app must remain usable as the curriculum expands.

Future work should include:
- browser QA on laptop and mobile
- keyboard-only QA
- screen reader spot checks
- chunk splitting for large lazy-loaded vocabulary bundles
- content validation and route sanity checks

Definition of done for this priority:
- the expanded curriculum remains fast, accessible, and stable on GitHub Pages

### 36.8 Agent handoff rules

Future agents continuing this PRD should follow these rules:
- prefer depth in Chapter 1 and Chapter 2 over adding more empty scaffolding
- prefer one real completed lesson over ten placeholder lessons
- keep all learner-facing explanation concise
- use Mandarin-speaker confusion as the primary content-selection heuristic
- keep the learner-facing structure simple: Chapter 1, Chapter 2, endless practice
- keep content static, GitHub Pages compatible, and local-storage based
