# Voicest v1.5x — All Features Documentation

Voicest is an all-in-one browser-based singing voice synthesizer and digital audio workstation (DAW) inspired by UTAU. It runs 100% client-side in the browser using Web Audio, WebAssembly, and modern Web APIs with no server requirement.

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
  - English-to-Kana phonemizer (EN2JA+).
- **UTAU Voicebank Support**:
  - Load folders, `.zip`, `.uar`, and `.rar` archives.
  - Auto-reads `oto.ini` and `prefix.map` with support for Shift-JIS and UTF-8 encodings.
  - Reclist formats: CV, VCV, and CVVC with automatic alias detection.
- **Multi-pitch Voicebank Support**:
  - Auto-detects pitch tiers (e.g. `_A3`, `_C4`, `_F4`, `_A4`, `↑`, `↓`) directly from oto aliases even when `prefix.map` is missing.
  - Resolves note pitches to the nearest available pitch tier, ensuring seamless fallback without muted notes.
- **WORLD Vocoder**:
  - High-quality resynthesis using WebAssembly WORLD (Dio, CheapTrick, D4C, and Synthesis).
  - Optimized LRU analysis cache and synthesis memoization for lag-free playback and rendering.

---

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
  - Licensed under the Apache-2.0 License. Contributors: Gemini, LazioP, Claude. See [LICENSE](./LICENSE).

### Complete Verbatim License Texts & Legal Notices
For 100% legal compliance and attribution, the complete, unabridged license texts for all components are provided in:
- **Application License**: [`LICENSE`](./LICENSE) (Apache License 2.0 full text)
- **Third-Party Notices**: [`THIRD-PARTY-NOTICES.md`](./THIRD-PARTY-NOTICES.md) (Verbatim BSD, MIT, ISC, and dual-license declarations)

---

### Open Source Community Notice
The full open-source codebase for Voicest v1.5x will be released soon for the global vocal synthesizer and music production community.


