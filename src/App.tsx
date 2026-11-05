/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PitchVisualizer from './components/PitchVisualizer';
import { VocalNote } from './lib/pitch-contour';
import { Language } from './lib/i18n';

const LANGS: Language[] = ['vi', 'en', 'ja', 'zh', 'ko'];

interface VoicestState {
  notes: VocalNote[];
  bpm: number;
  trackName: string;
  currentTime: number;
  isPlaying: boolean;
  lang: Language;
}

/** Chữ ký rẻ để biết danh sách nốt có thật sự đổi hay không (tránh render lại mỗi 150ms). */
function notesSignature(notes: readonly VocalNote[]): string {
  let sig = `${notes.length}`;
  for (const n of notes) {
    sig += `|${n.s},${n.l},${n.p},${n.t ?? ''},${n.pc ? n.pc.length : 0}`;
    if (n.pc && n.pc.length) sig += `,${n.pc[0]},${n.pc[n.pc.length - 1]}`;
  }
  return sig;
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sigRef = useRef('');

  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState<VocalNote[]>([]);
  const [bpm, setBpm] = useState(120);
  const [trackName, setTrackName] = useState('Vocal');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleSeek = useCallback((timeSec: number) => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'SEEK_VOICEST', time: timeSec }, window.location.origin);
    setCurrentTime(timeSec);
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      // chỉ nhận tin từ chính iframe Voicest, cùng origin
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.origin !== window.location.origin) return;
      const d = e.data;
      if (!d || typeof d !== 'object') return;

      if (d.type === 'VOICEST_STATE') {
        const incoming: VoicestState = d;
        const sig = notesSignature(incoming.notes ?? []);
        if (sig !== sigRef.current) {
          sigRef.current = sig;
          setNotes(incoming.notes ?? []);
        }
        if (typeof incoming.bpm === 'number') setBpm(incoming.bpm);
        if (incoming.trackName) setTrackName(incoming.trackName);
        setIsPlaying(!!incoming.isPlaying);
        setCurrentTime((prev) => (Math.abs(prev - incoming.currentTime) > 0.01 ? incoming.currentTime : prev));
        if (LANGS.includes(incoming.lang)) setLang(incoming.lang);
      } else if (d.type === 'VOICEST_LANG_CHANGE') {
        if (LANGS.includes(d.lang)) setLang(d.lang);
      } else if (d.type === 'VOICEST_CMD') {
        if (d.cmd === 'f0') setExpanded((v) => !v);
        else if (d.cmd === 'fullscreen') toggleFullscreen();
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [toggleFullscreen]);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#e0f7ee', overflow: 'hidden' }}>
      <iframe
        ref={iframeRef}
        title="Voicest"
        src="./voicest.html"
        allow="autoplay; fullscreen; microphone"
        style={{ flex: 1, minHeight: 0, width: '100%', border: 0, background: '#e0f7ee' }}
      />
      <PitchVisualizer
        notes={notes}
        bpm={bpm}
        trackName={trackName}
        currentTime={currentTime}
        isPlaying={isPlaying}
        lang={lang}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
        onSeek={handleSeek}
      />
    </div>
  );
}
