"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/entities/story";
import { useAudio } from "@/shared/lib/useAudio";
import { SettingsModal } from "@/widgets/settings-modal";
import styles from "./StartPage.module.scss";

export function StartPage() {
  const router = useRouter();
  const { hasSavedGame, resetGame, setStep, currentStep } = useGameStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { play, stop } = useAudio({ src: "/sounds/intro.mp3" });

  useEffect(() => {
    setMounted(true);
    play();
    return () => stop();
  }, [play, stop]);

  const handleNewGame = useCallback(() => {
    stop();
    resetGame();
    router.push("/story");
  }, [stop, resetGame, router]);

  const handleContinue = useCallback(() => {
    stop();
    setStep(currentStep);
    router.push("/story");
  }, [stop, setStep, currentStep, router]);

  const saved = mounted && hasSavedGame();

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} />

      <button
        className={styles.settingsButton}
        onClick={() => setIsSettingsOpen(true)}
        aria-label="Настройки"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo.webp"
            alt="Сон Мёбиуса"
            width={280}
            height={160}
            className={styles.logoImage}
            priority
          />
          <h1 className={styles.logo}>Сон Мёбиуса</h1>
          <p className={styles.subtitle}>Интерактивная новелла</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={handleNewGame}>
            Новая игра
          </button>

          {saved && (
            <button
              className={styles.secondaryButton}
              onClick={handleContinue}
            >
              Продолжить
            </button>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.footerLink}
          onClick={() => router.push("/credits")}
        >
          Об авторе
        </button>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
