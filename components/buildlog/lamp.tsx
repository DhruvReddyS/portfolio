"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lamp = "off" | "on";

type LampValue = {
  /** "off" is the dark drafting surface (default), "on" is warm paper. */
  lamp: Lamp;
  toggle: () => void;
};

const LampContext = createContext<LampValue>({ lamp: "off", toggle: () => {} });

const STORAGE_KEY = "buildlog-lamp";

export function LampProvider({ children }: { children: React.ReactNode }) {
  const [lamp, setLamp] = useState<Lamp>("off");

  // Restore the visitor's choice after hydration so SSR stays deterministic.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "on" || stored === "off") {
        queueMicrotask(() => setLamp(stored));
      }
    } catch {
      /* private mode: stay on the default */
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.lamp = lamp;
    // Tailwind's dark variants inside imported components follow the lamp.
    document.documentElement.classList.toggle("dark", lamp === "off");
    try {
      window.localStorage.setItem(STORAGE_KEY, lamp);
    } catch {
      /* ignore */
    }
  }, [lamp]);

  const toggle = useCallback(() => {
    setLamp((value) => (value === "off" ? "on" : "off"));
  }, []);

  const value = useMemo(() => ({ lamp, toggle }), [lamp, toggle]);

  return <LampContext.Provider value={value}>{children}</LampContext.Provider>;
}

export function useLamp() {
  return useContext(LampContext);
}
