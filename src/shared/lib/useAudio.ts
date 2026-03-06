"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSettingsStore } from "@/features/settings";

interface UseAudioOptions {
  src: string;
  loop?: boolean;
  fadeInMs?: number;
  fadeOutMs?: number;
}

export function useAudio({
  src,
  loop = true,
  fadeInMs = 1500,
  fadeOutMs = 1000,
}: UseAudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const targetVolumeRef = useRef(0);
  const musicVolume = useSettingsStore((s) => s.musicVolume);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, loop]);

  useEffect(() => {
    const effectiveVolume = soundEnabled ? musicVolume : 0;
    targetVolumeRef.current = effectiveVolume;
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.volume = effectiveVolume;
    }
  }, [musicVolume, soundEnabled]);

  const fadeTo = useCallback(
    (audio: HTMLAudioElement, target: number, durationMs: number) => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);

      const start = audio.volume;
      const diff = target - start;
      if (Math.abs(diff) < 0.01) {
        audio.volume = target;
        return;
      }

      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - (-2 * progress + 2) ** 2 / 2;

        audio.volume = Math.max(0, Math.min(1, start + diff * eased));

        if (progress < 1) {
          fadeRef.current = requestAnimationFrame(step);
        } else {
          fadeRef.current = null;
        }
      };

      fadeRef.current = requestAnimationFrame(step);
    },
    []
  );

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const vol = targetVolumeRef.current;
    audio.volume = 0;
    const promise = audio.play();
    if (promise) {
      promise
        .then(() => fadeTo(audio, vol, fadeInMs))
        .catch(() => {});
    }
  }, [fadeInMs, fadeTo]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    fadeTo(audio, 0, fadeOutMs);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }, fadeOutMs + 50);
  }, [fadeOutMs, fadeTo]);

  const switchTo = useCallback(
    (newSrc: string) => {
      const oldAudio = audioRef.current;

      if (oldAudio && !oldAudio.paused) {
        fadeTo(oldAudio, 0, fadeOutMs);
        setTimeout(() => {
          oldAudio.pause();
          oldAudio.src = "";
        }, fadeOutMs + 50);
      }

      const newAudio = new Audio(newSrc);
      newAudio.loop = loop;
      newAudio.volume = 0;
      audioRef.current = newAudio;

      setTimeout(() => {
        const promise = newAudio.play();
        if (promise) {
          promise
            .then(() => fadeTo(newAudio, targetVolumeRef.current, fadeInMs))
            .catch(() => {});
        }
      }, fadeOutMs);
    },
    [loop, fadeInMs, fadeOutMs, fadeTo]
  );

  return { play, stop, switchTo };
}
