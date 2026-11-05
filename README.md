# Voicest

[![CI](https://github.com/Gitbuo/Voicest/actions/workflows/ci.yml/badge.svg)](https://github.com/Gitbuo/Voicest/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/Gitbuo/Voicest/actions/workflows/pages.yml/badge.svg)](https://github.com/Gitbuo/Voicest/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Voicest is an all-in-one browser-based singing voice synthesizer and digital audio workstation (DAW) inspired by UTAU. It runs 100% client-side in the browser using Web Audio, WebAssembly, and modern Web APIs with no server requirement.

**Open it in your browser: https://gitbuo.github.io/Voicest/**

## Highlights

| Feature | What it does | Details |
| --- | --- | --- |
| UTAU voicebanks | Load `.zip` / `.rar` / `.uar` archives or folders (CV, VCV, CVVC, multi-pitch), `oto.ini` and `prefix.map` in Shift-JIS or UTF-8 | [Vocal engines & voicebanks](#5-vocal-engines--voicebanks) |
| Saved voicebanks | Imported voicebanks are kept in the browser (IndexedDB) and restored on the next visit | [Saved voicebanks](#5-vocal-engines--voicebanks) |
| Online voicebanks | Host big voicebanks as ≤ 50 MB hashed parts; the browser downloads only the WAVs a song uses (HTTP Range), verifies SHA-256 and caches them | [Online voicebanks](#online-voicebanks-in-detail), [Hosting](#hosting-voicebanks) |
| Auto-tune (frq) | Natural pitch curves (glide, overshoot, end-of-note fall) computed from the voicebank `.frq` files, updated in the background as you edit | [Auto-tune (frq)](#auto-tune-frq) |
| Cestloid | Built-in formant singing voice (no voicebank needed) with clarity EQ and editable k-a phoneme timing | [Cestloid](#cestloid-built-in-voice) |
| Auto-Oto (CV) | Record or upload CV samples and generate `oto.ini` automatically | [Auto-Oto](#6-auto-oto-generator-cv-voicebanks) |
| WORLD vocoder | WebAssembly WORLD resampler for pitch / formant shifting | [Vocal engines](#5-vocal-engines--voicebanks) |
| Export / import | WAV, MP3, OGG audio export; UST, USTX, SVP and MIDI projects | [Export & import](#7-export--import-formats) |
| 5 languages | English (default), Tiếng Việt, 日本語, 中文, 한국어 — UI and messages follow the selected language | — |
| Offline | Service worker caches the app; saved and downloaded voicebanks work without a connection | [Online voicebanks](#online-voicebanks-in-detail) |
| 100 MB import limit | Every local import is ≤ 100 MB; `scripts/clean-voicebank.mjs` shrinks a voicebank below it | [Import size limit](#5-vocal-engines--voicebanks) |

## Quick start

Requirements: Node.js 22.6+ (see `.nvmrc`).

```bash
npm ci            # install dependencies
npm run dev       # dev server on http://localhost:3000
npm run lint      # type check (tsc --noEmit)
npm test          # unit tests (node --test)
npm run build     # production build in dist/
npm run preview   # serve dist/ locally
```

| Path | Contents |
| --- | --- |
| `public/voicest.html` | The editor itself (engines, piano roll, voicebank loader, i18n), loaded in an iframe |
| `src/` | React shell (`App.tsx`), pitch visualizer and tested helpers in `src/lib/` |
| `scripts/` | `clean-voicebank.mjs` (shrink + zip a voicebank) and `pack-voicebank.mjs` (pack a voicebank for hosting) |
| `public/sw.js` | Service worker: app shell cache for offline use |
| `.github/workflows/` | `ci.yml` (lint, test, build on every push / PR) and `pages.yml` (deploy to GitHub Pages from `main`) |

Every push to `main` is checked by CI and published to GitHub Pages. To host voicebanks on the Pages site, pack them into `public/voicebanks/` (see [Hosting voicebanks](#hosting-voicebanks)); keep each file under GitHub's 100 MB limit (parts are 50 MB by default).

---

# Voicest v1.5x — All Features Documentation

---

## 1. Piano Roll & Editing Tools
- **Note Tool (1 / N)**: Click any cell to place a note, click to edit lyrics/phonemes, right-click to delete.
- **Pitch Points Tool (2)**: Click to add pitch curve points, drag to shape transitions, right-click to remove.
- **Tuning Brush (3)**: Freehand continuous pitch drawing across notes with smooth cosine interpolation.
- **Lasso Tool (4 / V)**: Click and drag a marquee selection rectangle to batch-select multiple notes across bars.
- **Erase Tool (E)**: Click or drag to erase notes and pitch points quickly.
- **Clear Tune**: Instantly reset pitch deviations for selected notes or the active channel.
- **Auto-Quantize & Quantize (Q)**: Grid snapping for 1/4, 1/8, 1/16, 1/32, 1/64, and triplets (1/8T, 1/16T).
- **Legato Smoothing**: Automatic cosine S-curve pitch glide between adjacent notes (gap ≤ 50ms).
- **Note Overlap Prevention**: Intelligent avoidance of overlapping notes on the same melodic track.
- **Timeline & Transport**: BPM (40–240), Metronome, Tap Tempo, Bars (2–256), Loop mode, Swing timing, Master Volume.
- **Scale & Key Snapping**: Chromatic, Major, Minor, Pentatonic with key root selector.

---

## 2. Note Transposition & Step-by-Step Tuning
- **Step-by-step Semitone Shift**:
  - `▲ +1 Note` (Key `↑`): Shift pitch up by exactly 1 semitone (e.g. C4 → C#4 → D4).
  - `▼ -1 Note` (Key `↓`): Shift pitch down by exactly 1 semitone (e.g. D4 → C#4 → C4).
- **Octave Transposition**:
  - `▲ +12 Oct` (`Shift + ↑`): Transpose up 1 full octave (12 semitones, e.g. C3 → C4).
  - `▼ -12 Oct` (`Shift + ↓`): Transpose down 1 full octave (12 semitones, e.g. C4 → C3).
- **Audition Feedback**: Instant audio playback of transposed notes with real-time F0 visualizer updates.
- **Target Selection**: Transposes individually selected notes, lasso-selected groups, or the entire active channel.

---

## 3. Visual Note Coloring System
- **Track / Channel Colors**: Individual color pickers for every channel with responsive hex updates.
- **Pitch Rainbow Mode**: Harmonized chromatic palette assigning a distinct color to each of the 12 semitones:
  - C (Rose Red), C# (Coral), D (Warm Orange), D# (Amber), E (Golden Yellow), F (Lime), F# (Emerald), G (Cyan Blue), G# (Sky Blue), A (Purple), A# (Lilac), B (Magenta Pink).
- **Quick Palette Bar**: 8 curated vibrant colors (Sakura Pink, Mint, Cyan, Sunset, Lavender, Amber, Sky, Ruby) plus a full hex color picker.
- **Batch Coloring**: Click any palette swatch to color the selected note, all lasso-selected notes, or the track.

---

## 4. Channels & Instrument Switcher
- **Channels**: Supports unlimited tracks with volume sliders, Mute (M), Solo (S), reordering (▲▼), and deletion (✕).
- **Interactive Channel Instrument Selector**: Switch instruments on any channel with one click:
  - 🎹 **Piano**: Acoustic multi-harmonic piano synthesis.
  - 🎵 **Musicbox**: Chime bell synthesis.
  - 🎻 **Violin**: Sustained bowed string with vibrato LFO.
  - 🎸 **Guitar**: Plucked acoustic string with dynamic lowpass filtering.
  - 👾 **Chip 8-bit**: Square, Sawtooth, and Triangle waveforms.
  - 🎤 **Voice**: Cestloid or external UTAU voicebanks.
  - 🔊 **Sample**: Custom WAV sample playback with pitch-tracking and slice controls.
- **Quick Instrument Bar**: 1-click icon buttons to switch the active track's instrument immediately.
- **Auto-Gain Staging (`⚖️ Auto-Gain`)**: Intelligently scans all tracks, balances loudness, prevents digital clipping (> 0.92 peak) and boosts quiet tracks (< 0.28 peak) without altering dynamic balance.

---

## 5. Vocal Engines & Voicebanks
- **Built-in Cestloid Voice**:
  - Formant synthesis singing in Japanese romaji or kana (`ka`, `か`, `kya`, `がっこう`).
  - Sliders for Brightness, Breathiness, Vibrato, Formant, Gender, and Vocal Tension.
  - Clarity EQ on the voice: high-pass at 90 Hz, less low-mid mud (280 Hz), presence boosts at 2.6 kHz and 3.6 kHz that follow the **Clarity** slider, a de-esser band at 7.2 kHz and a gentle high shelf; voiced buzz is low-passed at 6 kHz, note attacks fade in over about 10 ms and the s / sh / ts / ch noise is kept soft.
  - English-to-Kana phonemizer (EN2JA+).
- **UTAU Voicebank Support**:
  - Load folders, `.zip`, `.uar`, and `.rar` archives.
  - Auto-reads `oto.ini` and `prefix.map` with support for Shift-JIS and UTF-8 encodings.
  - Reclist formats: CV, VCV, and CVVC with automatic alias detection.
- **Saved Voicebanks (browser storage)**:
  - Imported voicebanks are kept in the browser (IndexedDB) and loaded again automatically the next time Voicest opens, so they never need to be imported or downloaded again.
  - Archives are stored as-is; folders keep only the files Voicest needs (`.wav`, `.ini`, `.map`, `.txt`, `.frq`, images), skipping desktop-engine caches such as `.llsm`, `.mrq`, `.pmk`, `.uwf`.
  - The **Saved voicebanks** panel under the import buttons lists stored voicebanks with their size, lets you remove them, shows browser storage usage, and has a **Keep voicebanks in this browser** switch.
  - Data stays on the user's device only; clearing site data in the browser removes it.
- **Import size limit (100 MB)**:
  - Any single import (voicebank archive, voicebank folder, audio or project file) may be at most **100 MB**. Larger files are refused with a message, which keeps memory use low and stays under the 100 MB per-request limit of Cloudflare Tunnel (Free).
  - For folders, only the files Voicest reads are counted; desktop-engine cache files are ignored.
- **Shrinking a voicebank below 100 MB**: `node scripts/clean-voicebank.mjs <voicebank-folder> [output.zip] [--keep-frq]`
  - Removes cache files (`.llsm`, `.mrq`, `.pmk`, `.uwf`, `.uwf2`, `.frq`) and unused text files, keeps every WAV untouched, prints the size before/after and writes a `.zip` ready to import. Needs only Node.js 18+, no extra packages.
  - If the ZIP is still over 100 MB, split the voicebank (for example one ZIP per pitch folder) and import each part.
- **Online voicebanks (low bandwidth hosting)**:
  - Large voicebanks (hundreds of MB or more) can be hosted next to Voicest or on any static host / object storage instead of being imported. Pack them with `node scripts/pack-voicebank.mjs <voicebank-folder> [out-dir] [--name "Display name"] [--chunk-mb 50] [--keep-frq]`.
  - The script removes cache files, keeps every WAV byte-for-byte, and writes `<out-dir>/<name>/manifest.json` (every file with its part, offset, size and SHA-256) plus `part001-<hash>.bin`, … of at most 50 MB each, and updates `<out-dir>/index.json`.
  - In Voicest, open **Saved voicebanks → Online voicebanks** and paste the `manifest.json` link, click a voicebank listed under **Available on this site** (read from `voicebanks/index.json`), or open `voicest.html?vb=<manifest URL>`.
  - Adding a voicebank downloads only the manifest, `oto.ini`, `character.txt` and `prefix.map`. Each WAV is fetched with an HTTP Range request the first time a song uses it, checked against its SHA-256, and kept in the browser (Cache Storage). Repeat visits download only the small manifest. **⤓** downloads all parts for offline use (one request per part); **✕** forgets the voicebank and deletes its cached files.
  - A service worker (`public/sw.js`) caches the app itself, so Voicest also opens offline after the first visit (https or localhost only).
- **Multi-pitch Voicebank Support**:
  - Auto-detects pitch tiers (e.g. `_A3`, `_C4`, `_F4`, `_A4`, `↑`, `↓`) directly from oto aliases even when `prefix.map` is missing.
  - Resolves note pitches to the nearest available pitch tier, ensuring seamless fallback without muted notes.
- **WORLD Vocoder**:
  - High-quality resynthesis using WebAssembly WORLD (Dio, CheapTrick, D4C, and Synthesis).
  - Optimized LRU analysis cache and synthesis memoization for lag-free playback and rendering.

---

## Hosting voicebanks

Every request stays below the 100 MB per-request limit of Cloudflare Tunnel (Free): a WAV range is a few hundred KB, a whole part at most 50 MB.

**Same server as Voicest (Cloudflare Tunnel, Cloudflare Pages, any static host)**
1. `node scripts/pack-voicebank.mjs "path/to/My Voicebank" public/voicebanks`
2. `npm run build` (the voicebanks are copied to `dist/voicebanks/`).
3. Serve `dist/` with a server that supports Range requests, e.g. `npx vite preview --port 3000 --host 0.0.0.0`, then `cloudflared tunnel --url http://localhost:3000`.
4. Cache headers: part files can be cached forever (`Cache-Control: public, max-age=31536000, immutable`, their name contains their hash); `*.json` and `sw.js` should use `Cache-Control: no-cache`. `public/_headers` already sets this on Cloudflare Pages.

**Object storage (Cloudflare R2, S3, Backblaze B2)**
1. Pack to a folder, e.g. `node scripts/pack-voicebank.mjs "My Voicebank" out`, and upload `out/` keeping the folder layout (e.g. `rclone copy out r2:my-bucket/voicebanks`). R2 has no egress fees.
2. Allow Voicest's site to read it with CORS (R2: bucket → Settings → CORS policy):
   ```json
   [{"AllowedOrigins":["https://your-voicest-site"],"AllowedMethods":["GET","HEAD"],"AllowedHeaders":["Range"],"ExposeHeaders":["Content-Length","Content-Range","Accept-Ranges"],"MaxAgeSeconds":86400}]
   ```
3. Use the public URL of `manifest.json` in **Online voicebanks**, or link to `https://your-voicest-site/?vb=https://…/manifest.json`.

Re-packing a changed voicebank gives the changed parts new names; browsers pick up the new manifest on their next visit and only download what changed.

Not included: server-side rendering of UTAU voices to Opus (needs a VPS running a UTAU resampler); with the setup above the browser still renders everything locally.

## Online voicebanks in detail

**Why:** UTAU voicebanks are often 200 MB – 2 GB and full of desktop-engine cache files. Downloading a whole archive on every visit wastes bandwidth and breaks per-request limits such as Cloudflare Tunnel Free (100 MB). Online voicebanks are downloaded sample by sample and kept in the browser.

**Pack** (on your computer, Node.js 18+, no extra packages):
```bash
node scripts/pack-voicebank.mjs "path/to/My Voicebank" public/voicebanks --name "My Voicebank"
```
| Output | Purpose |
| --- | --- |
| `public/voicebanks/<slug>/manifest.json` | Name, total size and, for every file, its part, byte offset, size and SHA-256 |
| `public/voicebanks/<slug>/part001-<hash>.bin`, … | The voicebank files concatenated into parts of at most 50 MB (`--chunk-mb 1…95`); the name contains the content hash, so parts can be cached forever |
| `public/voicebanks/index.json` | List of voicebanks hosted on the site, shown under **Available on this site** |

Cache files (`.llsm`, `.mrq`, `.pmk`, `.uwf`, `.uwf2`, and `.frq` unless `--keep-frq`) are removed; WAV files are copied byte for byte.

**Use:** open **Saved voicebanks → Online voicebanks** and either click a voicebank under **Available on this site**, paste a `manifest.json` URL, or share a link like `https://gitbuo.github.io/Voicest/?vb=<manifest URL>`.

**What is downloaded**
| Moment | Network |
| --- | --- |
| Adding the voicebank | `manifest.json` + `oto.ini`, `character.txt`, `prefix.map`, images (a few KB) |
| A note needs a sample for the first time | Only that WAV, through an HTTP `Range` request inside its part; checked against the SHA-256 in the manifest |
| Next visits | Only `manifest.json` (revalidated); every sample already used comes from Cache Storage (`voicest-vb-files-v1`) |
| **⤓** (download for offline) | Every part, one request each (≤ 50 MB) |
| **✕** | Forgets the voicebank and deletes its cached files |

Hosts without Range support still work: the whole part is fetched once and cached. Updating a voicebank only changes the parts whose content changed.

## Auto-tune (frq)

The **Auto-tune (frq)** checkbox in the Tools bar (on by default, remembered in the browser) gives Voice notes a natural pitch curve without drawing it by hand:

- **Glide between notes:** when a note directly follows another at a different pitch, the pitch moves with a cosine curve whose length grows with the interval (40 ms + 9 ms per semitone, at most 140 ms or half the note).
- **Voicing-aware start:** the glide starts when the sample actually becomes voiced. Voicest reads the sample's UTAU `.frq` file (`FREQ0003`: f0 and amplitude per frame) and finds the first frame with f0 > 40 Hz and enough amplitude after the oto offset.
- **Overshoot:** jumps of 3 semitones or more overshoot slightly (up to 0.18 semitone) and settle within about 90 ms.
- **End-of-note fall:** on long notes (≥ 1 beat) that are not followed by a connected note, if the recording itself drifts down at the end (median f0 of the tail vs. the middle, below −15 cents) the last 20 % of the note falls a little, like the singer did.
- **Background and incremental:** the first run processes every note; afterwards only the edited note and its two neighbours are recalculated. Notes whose pitch curve you drew yourself (Pitch pts / Tuning brush) are never overwritten.
- Notes without a `.frq` file still get the glide and overshoot; only the voicing-aware start and the fall need it. Keep `.frq` files with `--keep-frq` when packing an online voicebank if you rely on them.

## Cestloid (built-in voice)

Cestloid is a formant synthesizer that sings Japanese romaji / kana (and English through EN2JA+) with no voicebank. Sliders: Brightness, Breathiness, Vibrato, Formant, Gender, Tension and **Clarity**. See the clarity EQ in [Vocal engines](#5-vocal-engines--voicebanks) and the editable consonant / vowel timing below.

## 6. Auto-Oto Generator (CV Voicebanks)
- **Dedicated CV Tool**: Specially tailored for raw CV (Consonant + Vowel / 単独音) recordings.
- **RMS Energy Boundary Detection**: Analyzes sliding-window Root-Mean-Square energy to find:
  - `Offset`: Voice attack onset (noise floor threshold).
  - `Consonant`: Fixed consonant duration before vowel sustain.
  - `Preutterance`: Attack lead-in time before the musical beat.
  - `Overlap`: Crossfade blend duration.
  - `Cutoff`: Trailing silence cutoff (negative ms from file end).
- **Interactive Waveform Inspector**: Visual canvas displaying 5 colored UTAU markers with real-time numeric inputs.
- **Microphone Recording & WAV Upload**: Record syllables sequentially from the Japanese 50-sounds chart or batch-upload raw WAV files.
- **Export Options**: Copy `oto.ini`, download `oto.ini`, or download a complete bundled `CV_Voicebank.zip` ready for use.

---

## Cestloid phoneme timing (k-a)
- The **Phoneme** strip under the piano roll shows every Voice note as `k-a`: onset consonant, the **main vowel in the middle**, and an optional coda (`a-t`).
- Three draggable bars per note: **consonant start**, the **k|a boundary** (Shift + drag moves the whole consonant without changing its length) and the **vowel|coda boundary**. A live millisecond readout is shown while dragging.
- The synth follows the strip exactly: the vowel starts at the note start plus the k|a offset (`cp`), the consonant length is `ct`, and the coda length is `cc`. Notes without edits behave exactly as before; the **Timing** button resets the channel; Ctrl+Z undoes a drag.
- The edit box accepts the same notation (`k-a`, `sh-i`).

---

## 7. Export & Import Formats
- **Export Audio dialog** (`Export Audio…` button): one pop-up for everything audio-related.
  - **Format**: choose **WAV** (uncompressed 16-bit), **MP3** (192 kbps, encoded in-browser with `lamejs`) or **OGG** (Opus via `MediaRecorder`; some browsers store it as `.webm`, and the dialog tells you which). OGG is disabled automatically on browsers that cannot encode it.
  - **Stereo balance**: Left–Right slider (−100 … +100, snaps to centre, double-click to reset). Only the opposite channel is attenuated, so the balance never adds gain or clipping. The L/R level in dB is shown live.
  - **Download**: renders the mix, applies the balance, encodes and downloads, with progress and status messages. Closing the dialog cancels the pending download.
  - **Language**: every label follows the current app language (Vietnamese, English, Japanese, Chinese, Korean) and updates instantly when you switch language.
  - **Project & Notation**: UST, MIDI, USTX, SVP.
- **Import**:
  - UST, MIDI, USTX, SVP, and raw audio files (drag-and-drop supported).

---

## 8. Keyboard Shortcuts
| Key | Action |
|---|---|
| `Space` | Play / Stop playback |
| `1` `2` `3` `4` | Select Tools: Note, Pitch pts, Tuning brush, Erase |
| `V` | Select Lasso tool (batch select) |
| `↑` / `↓` | Transpose by 1 semitone (C4 → C#4) |
| `Shift + ↑` / `Shift + ↓` | Transpose by 1 octave (12 semitones) |
| `Delete` / `Backspace` | Delete selected notes |
| `Q` | Quantize active track |
| `[` / `]` | Decrease / Increase default note length |
| `L` | Toggle Loop playback |
| `M` | Toggle Metronome |
| `Home` | Return playhead to start |
| `Ctrl + Z` / `Ctrl + Y` | Undo / Redo (50 steps) |
| `Ctrl + S` | Save project |
| `?` | Open README & Credits |

---

## 9. Open Source Licenses & Attributions

Voicest is built with gratitude to the creators of open-source vocal synthesis technologies:

- **WORLD Vocoder**:
  - Original Algorithm: Masanori Morise (Modified BSD 3-Clause License).
  - WebAssembly Port (World.JS): YuzukiTsuru (Modified BSD 3-Clause / MIT).
- **Wavtool (Organum)**:
  - Version 0.0.8 by KakouLabs / KYURAE KIM (MIT License). Sample concatenation, volume envelopes, and soft limiting.
- **Resampler (straycat-rs)**:
  - Developed by UtaUtaUtau (MIT / Apache-2.0 License).
- **Phonemizer (EN2JA+)**:
  - Created by Cadlaxa, integrated into OpenUtau (MIT License).
- **MP3 Encoder (lamejs)**:
  - Pure JavaScript LAME MP3 encoder by Janez Stupar & contributors (Licensed under MIT; dual-licensed with LGPL-3.0).
- **Data-Driven Documents (D3.js)**:
  - Mike Bostock (ISC License).
- **Voicest Application**:
  - Licensed under the MIT License. Contributors: Gemini, Gitbuo, Claude, Devin. See [LICENSE](./LICENSE).

### Complete Verbatim License Texts & Legal Notices
For 100% legal compliance and attribution, the complete, unabridged license texts for all components are provided in:
- **Application License**: [`LICENSE`](./LICENSE) (MIT License full text)
- **Third-Party Notices**: [`THIRD-PARTY-NOTICES.md`](./THIRD-PARTY-NOTICES.md) (Verbatim BSD, MIT, ISC, and dual-license declarations)

---

### Open Source Community Notice
The full open-source codebase for Voicest v1.5x will be released soon for the global vocal synthesizer and music production community.


