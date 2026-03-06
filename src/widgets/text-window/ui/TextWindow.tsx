"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useTypewriter } from "@/shared/lib/useTypewriter";
import styles from "./TextWindow.module.scss";

interface TextWindowProps {
  text: string;
  onNext: () => void;
  onPrev: () => void;
  onCredits?: () => void;
  onTextComplete?: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
  isHotspotStep?: boolean;
  hotspotClicked?: boolean;
}

export function TextWindow({
  text,
  onNext,
  onPrev,
  onCredits,
  onTextComplete,
  canGoNext,
  canGoPrev,
  isLastStep,
  isHotspotStep = false,
  hotspotClicked = false,
}: TextWindowProps) {
  const { displayedText, isComplete, complete } = useTypewriter(text, 25);
  const textAreaRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const firedCompleteRef = useRef(false);

  const nextBlocked = isHotspotStep && !hotspotClicked && isComplete;

  useEffect(() => {
    firedCompleteRef.current = false;
  }, [text]);

  useEffect(() => {
    if (isComplete && !firedCompleteRef.current) {
      firedCompleteRef.current = true;
      onTextComplete?.();
    }
  }, [isComplete, onTextComplete]);

  useEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;

    const check = () => {
      const hasOverflow = el.scrollHeight - el.scrollTop - el.clientHeight > 4;
      setCanScroll(hasOverflow);
    };

    const frameId = requestAnimationFrame(check);
    el.addEventListener("scroll", check, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      el.removeEventListener("scroll", check);
    };
  }, [displayedText]);

  const handleNext = useCallback(() => {
    if (!isComplete) {
      complete();
    } else if (!nextBlocked) {
      onNext();
    }
  }, [isComplete, complete, onNext, nextBlocked]);

  return (
    <div className={styles.container}>
      <div className={styles.window}>
        <div className={styles.textAreaWrapper}>
          <div className={styles.textArea} ref={textAreaRef}>
            <p className={styles.text}>
              {displayedText}
              {!isComplete && <span className={styles.cursor}>|</span>}
            </p>
          </div>

          <div className={`${styles.scrollHint} ${canScroll ? styles.scrollHintVisible : ""}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect
                x="7"
                y="2"
                width="10"
                height="17"
                rx="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="12"
                y1="6"
                x2="12"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={styles.scrollWheel}
              />
              <path
                d="M9 21l3 2 3-2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className={styles.controls}>
          <button
            className={styles.navButton}
            onClick={onPrev}
            disabled={!canGoPrev}
            aria-label="Назад"
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
            <span className={styles.navLabel}>Назад</span>
          </button>

          {isLastStep && isComplete ? (
            <button
              className={`${styles.navButton} ${styles.creditsButton}`}
              onClick={onCredits}
              aria-label="К титрам"
            >
              <span>К титрам</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M8 4l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : nextBlocked ? (
            <span className={styles.hotspotHint}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Нажмите на выделенную область
            </span>
          ) : (
            <button
              className={`${styles.navButton} ${styles.navButtonNext}`}
              onClick={handleNext}
              disabled={!canGoNext && isComplete}
              aria-label="Далее"
            >
              <span className={styles.navLabel}>
                {!isComplete ? "Пропустить" : "Далее"}
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M8 4l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
