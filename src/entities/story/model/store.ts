"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storySteps } from "../config/data";

interface GameState {
  currentStep: number;
  maxReachedStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetGame: () => void;
  hasSavedGame: () => boolean;
  isFirstStep: () => boolean;
  isLastStep: () => boolean;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      maxReachedStep: 0,

      setStep: (step: number) => {
        const clamped = Math.max(0, Math.min(step, storySteps.length - 1));
        set((state) => ({
          currentStep: clamped,
          maxReachedStep: Math.max(state.maxReachedStep, clamped),
        }));
      },

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < storySteps.length - 1) {
          set((state) => ({
            currentStep: currentStep + 1,
            maxReachedStep: Math.max(state.maxReachedStep, currentStep + 1),
          }));
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      resetGame: () => {
        set({ currentStep: 0, maxReachedStep: 0 });
      },

      hasSavedGame: () => {
        return get().maxReachedStep > 0;
      },

      isFirstStep: () => {
        return get().currentStep === 0;
      },

      isLastStep: () => {
        return get().currentStep === storySteps.length - 1;
      },
    }),
    {
      name: "novella-game-state",
    }
  )
);
