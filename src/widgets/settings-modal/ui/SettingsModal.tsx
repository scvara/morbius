"use client";

import { useCallback } from "react";
import { useSettingsStore } from "@/features/settings";
import styles from "./SettingsModal.module.scss";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { musicVolume, soundEnabled, setMusicVolume, toggleSound } =
    useSettingsStore();

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMusicVolume(parseFloat(e.target.value));
    },
    [setMusicVolume]
  );

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className={styles.title}>Настройки</h2>

        <div className={styles.setting}>
          <div className={styles.settingHeader}>
            <label className={styles.label}>Громкость музыки</label>
            <span className={styles.value}>
              {Math.round(musicVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={musicVolume}
            onChange={handleVolumeChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.setting}>
          <div className={styles.settingHeader}>
            <label className={styles.label}>Звуковые эффекты</label>
            <button
              className={`${styles.toggle} ${soundEnabled ? styles.toggleOn : ""}`}
              onClick={toggleSound}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
