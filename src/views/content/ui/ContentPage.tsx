"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGameStore, storySteps } from "@/entities/story";
import { useAudio } from "@/shared/lib/useAudio";
import { asset } from "@/shared/lib/asset";
import { SettingsModal } from "@/widgets/settings-modal";
import { TextWindow } from "@/widgets/text-window";
import { HotspotOverlay } from "@/widgets/hotspot";
import styles from "./ContentPage.module.scss";

const AUTO_CREDITS_DELAY = 10_000;
const FINISH_MUSIC_FROM_STEP = 32;

export function ContentPage() {
  const router = useRouter();
  const { currentStep, nextStep, prevStep, isFirstStep, isLastStep } =
    useGameStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hotspotClicked, setHotspotClicked] = useState(false);
  const [textComplete, setTextComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const novellaAudio = useAudio({
    src: asset("/sounds/novella.mp3"),
    fadeInMs: 2000,
    fadeOutMs: 1500,
  });
  const finishAudio = useAudio({
    src: asset("/sounds/finish.mp3"),
    fadeInMs: 2000,
    fadeOutMs: 1500,
  });

  const currentTrackRef = useRef<"novella" | "finish" | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHotspotClicked(false);
    setTextComplete(false);
  }, [currentStep]);

  const handleTextComplete = useCallback(() => {
    setTextComplete(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const stepIndex = currentStep + 1;
    const shouldPlayFinish = stepIndex >= FINISH_MUSIC_FROM_STEP;
    const neededTrack = shouldPlayFinish ? "finish" : "novella";

    if (currentTrackRef.current !== neededTrack) {
      if (currentTrackRef.current === "novella") {
        novellaAudio.stop();
      } else if (currentTrackRef.current === "finish") {
        finishAudio.stop();
      }

      setTimeout(
        () => {
          if (neededTrack === "novella") {
            novellaAudio.play();
          } else {
            finishAudio.play();
          }
        },
        currentTrackRef.current === null ? 0 : 1500
      );

      currentTrackRef.current = neededTrack;
    }
  }, [mounted, currentStep, novellaAudio, finishAudio]);

  useEffect(() => {
    return () => {
      novellaAudio.stop();
      finishAudio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToCredits = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    finishAudio.stop();
    novellaAudio.stop();
    setTimeout(() => {
      router.push("/credits");
    }, 800);
  }, [router, isFadingOut, finishAudio, novellaAudio]);

  useEffect(() => {
    if (!mounted) return;

    if (isLastStep()) {
      timerRef.current = setTimeout(() => {
        goToCredits();
      }, AUTO_CREDITS_DELAY);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [mounted, currentStep, isLastStep, goToCredits]);

  const step = storySteps[currentStep];
  const isHotspotStep = !!step?.hotspot;

  const handleNext = useCallback(() => {
    if (isLastStep()) return;
    nextStep();
  }, [nextStep, isLastStep]);

  const handlePrev = useCallback(() => {
    if (isFirstStep()) return;
    prevStep();
  }, [prevStep, isFirstStep]);

  const handleHotspotClick = useCallback(() => {
    setHotspotClicked(true);
    setTimeout(() => {
      nextStep();
    }, 300);
  }, [nextStep]);

  const handleBack = useCallback(() => {
    novellaAudio.stop();
    finishAudio.stop();
    router.push("/");
  }, [router, novellaAudio, finishAudio]);

  if (!mounted || !step) return null;

  return (
    <div className={`${styles.page} ${isFadingOut ? styles.fadeOut : ""}`}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url('${asset(step.background)}')` }}
        key={step.background}
      >
        {isHotspotStep && step.hotspot && textComplete && !hotspotClicked && (
          <HotspotOverlay
            hotspot={step.hotspot}
            onClick={handleHotspotClick}
          />
        )}
      </div>

      <div className={styles.header}>
        <button
          className={styles.headerButton}
          onClick={handleBack}
          aria-label="На главную"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 4L6 10l6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className={styles.stepCounter}>
          {currentStep + 1} / {storySteps.length}
        </span>

        <button
          className={styles.headerButton}
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Настройки"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 15a3 3 0 100-6 3 3 0 000 6z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      <TextWindow
        text={step.text}
        onNext={handleNext}
        onPrev={handlePrev}
        onCredits={goToCredits}
        onTextComplete={handleTextComplete}
        canGoNext={!isLastStep()}
        canGoPrev={!isFirstStep()}
        isLastStep={isLastStep()}
        isHotspotStep={isHotspotStep}
        hotspotClicked={hotspotClicked}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
