"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  musicVolume: number;
  soundEnabled: boolean;
  setMusicVolume: (volume: number) => void;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      musicVolume: 0.5,
      soundEnabled: true,

      setMusicVolume: (volume: number) => {
        set({ musicVolume: Math.max(0, Math.min(1, volume)) });
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },
    }),
    {
      name: "novella-settings",
    }
  )
);
