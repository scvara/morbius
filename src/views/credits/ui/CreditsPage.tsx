"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/entities/story";
import { useAudio } from "@/shared/lib/useAudio";
import { asset } from "@/shared/lib/asset";
import styles from "./CreditsPage.module.scss";

export function CreditsPage() {
  const router = useRouter();
  const { resetGame } = useGameStore();
  const { play, stop } = useAudio({ src: asset("/sounds/titles.mp3"), fadeInMs: 2000 });

  useEffect(() => {
    play();
    return () => stop();
  }, [play, stop]);

  const handleRestart = useCallback(() => {
    stop();
    resetGame();
    router.push("/");
  }, [stop, resetGame, router]);

  const handleMenu = useCallback(() => {
    stop();
    router.push("/");
  }, [stop, router]);

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} />

      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <p className={styles.label}>Вы прочитали</p>
          <h1 className={styles.title}>Сон Мёбиуса</h1>
          <div className={styles.divider} />
        </div>

        <div className={styles.authorBlock}>
          <p className={styles.authorLabel}>Автор</p>
          <p className={styles.authorName}>Серый человечек</p>
        </div>

        <div className={styles.downloadBlock}>
          <a
            href={asset("/novella.docx")}
            download="Сон_Мёбиуса.docx"
            className={styles.downloadLink}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5M3 15v1a1 1 0 001 1h12a1 1 0 001-1v-1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Скачать оригинал
          </a>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={handleRestart}>
            Начать заново
          </button>
          <button className={styles.secondaryButton} onClick={handleMenu}>
            Главное меню
          </button>
        </div>
      </div>

      <p className={styles.footer}>Спасибо за чтение</p>
    </div>
  );
}
