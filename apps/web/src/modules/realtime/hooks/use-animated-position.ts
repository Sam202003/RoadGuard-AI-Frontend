'use client';

import { useEffect, useRef, useState } from 'react';
import { lerpLatLng } from '../utils/geo';
import type { LatLng } from '../types/tracking.types';

const DEFAULT_DURATION_MS = 750;

/**
 * Smoothly animates marker position between GPS updates (provider movement).
 */
export function useAnimatedPosition(
  target: LatLng | null,
  durationMs = DEFAULT_DURATION_MS,
): LatLng | null {
  const [display, setDisplay] = useState<LatLng | null>(target);
  const fromRef = useRef<LatLng | null>(target);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!target) {
      setDisplay(null);
      fromRef.current = null;
      return;
    }

    if (!fromRef.current) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }

    const from = fromRef.current;
    if (from.lat === target.lat && from.lng === target.lng) return;

    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      const next = lerpLatLng(from, target, t);
      setDisplay(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, durationMs]);

  return display;
}
