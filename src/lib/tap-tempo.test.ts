/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { recordTapTempo } from './tap-tempo.ts';

test('recordTapTempo computes average BPM from repeated taps', () => {
  let state = recordTapTempo([], 1000);
  assert.equal(state.bpm, null);
  assert.equal(state.timestamps.length, 1);

  // 500ms interval = 120 BPM
  state = recordTapTempo(state.timestamps, 1500);
  assert.equal(state.bpm, 120);

  // Another 500ms interval = 120 BPM
  state = recordTapTempo(state.timestamps, 2000);
  assert.equal(state.bpm, 120);
});

test('recordTapTempo resets history after long pause and clamps BPM', () => {
  const s1 = recordTapTempo([1000, 1500], 5000, 2500);
  assert.equal(s1.bpm, null);
  assert.deepEqual(s1.timestamps, [5000]);

  const fast = recordTapTempo([1000], 1100); // 600 BPM -> clamped to 240
  assert.equal(fast.bpm, 240);

  const slow = recordTapTempo([1000], 3000); // 30 BPM -> clamped to 40
  assert.equal(slow.bpm, 40);
});
