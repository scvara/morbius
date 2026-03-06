"use client";

import type { Hotspot } from "@/entities/story";
import styles from "./HotspotOverlay.module.scss";

interface HotspotOverlayProps {
  hotspot: Hotspot;
  onClick: () => void;
}

export function HotspotOverlay({ hotspot, onClick }: HotspotOverlayProps) {
  return (
    <button
      className={styles.hotspot}
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
      }}
      onClick={onClick}
      aria-label={hotspot.label}
    >
      <span className={styles.ring} />
      <span className={styles.dot} />
      <span className={styles.label}>{hotspot.label}</span>
    </button>
  );
}
