/**
 * @license
 * SPDX-License-Identifier: MIT
 */

export interface TapTempoResult {
  bpm: number | null;
  timestamps: number[];
}

/**
 * Records a tap timestamp and computes the average BPM from recent intervals.
 * Resets the tap history if the gap since the last tap exceeds `resetGapMs`.
 */
export function recordTapTempo(
  prevTimestamps: readonly number[],
  nowMs: number,
  resetGapMs = 2500,
  maxTaps = 8,
  minBpm = 40,
  maxBpm = 240,
): TapTempoResult {
  const last = prevTimestamps.length > 0 ? prevTimestamps[prevTimestamps.length - 1] : null;
  const base = last !== null && nowMs - last > resetGapMs ? [] : [...prevTimestamps];
  base.push(nowMs);
  const trimmed = base.slice(-maxTaps);

  if (trimmed.length < 2) {
    return { bpm: null, timestamps: trimmed };
  }

  let totalInterval = 0;
  for (let i = 1; i < trimmed.length; i++) {
    totalInterval += trimmed[i] - trimmed[i - 1];
  }
  const avgIntervalMs = totalInterval / (trimmed.length - 1);
  if (avgIntervalMs <= 0) {
    return { bpm: null, timestamps: trimmed };
  }

  const rawBpm = Math.round(60000 / avgIntervalMs);
  const clampedBpm = Math.max(minBpm, Math.min(maxBpm, rawBpm));
  return { bpm: clampedBpm, timestamps: trimmed };
}
