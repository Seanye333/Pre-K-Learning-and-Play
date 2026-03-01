"use client";

import { useEffect, useRef } from "react";

// Lazily loaded Howler to avoid SSR issues
type HowlInstance = {
  play: () => void;
  stop: () => void;
  unload: () => void;
};

type SoundMap = Record<string, string>;

export function useSound(soundMap: SoundMap) {
  const howlsRef = useRef<Record<string, HowlInstance>>({});
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    import("howler").then(({ Howl }) => {
      Object.entries(soundMap).forEach(([key, src]) => {
        howlsRef.current[key] = new Howl({ src: [src], preload: true });
      });
    });

    return () => {
      Object.values(howlsRef.current).forEach((h) => h.unload());
      howlsRef.current = {};
      loadedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = (key: string) => {
    const howl = howlsRef.current[key];
    if (howl) {
      howl.stop();
      howl.play();
    }
  };

  return { play };
}
