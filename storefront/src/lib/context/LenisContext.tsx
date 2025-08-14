"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useStateContext } from "./StateContext";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const { firstLoad } = useStateContext();
  const rafId = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    // Expose globally for scroll links
    window.lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }

    rafId.current = requestAnimationFrame(raf);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      lenis.destroy();

      delete window.lenis;
    };
  }, []);

  // Control scrolling based on firstLoad state
  useEffect(() => {
    if (lenisRef.current) {
      if (firstLoad) {
        // Enable scrolling when firstLoad is true
        lenisRef.current.start();
      } else {
        // Disable scrolling when firstLoad is false
        lenisRef.current.stop();
      }
    }
  }, [firstLoad]);

  return <>{children}</>;
}