"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTypewriterReturn {
  displayedText: string;
  isComplete: boolean;
  complete: () => void;
}

export function useTypewriter(
  text: string,
  speed: number = 30
): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const complete = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setDisplayedText(text);
    setIsComplete(true);
  }, [text]);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    indexRef.current = 0;
    lastTimeRef.current = 0;

    if (!text) {
      setIsComplete(true);
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= speed) {
        indexRef.current += 1;
        setDisplayedText(text.slice(0, indexRef.current));
        lastTimeRef.current = timestamp;

        if (indexRef.current >= text.length) {
          setIsComplete(true);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [text, speed]);

  return { displayedText, isComplete, complete };
}
