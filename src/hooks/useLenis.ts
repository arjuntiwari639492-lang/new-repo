// src/hooks/useLenis.ts
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export const useLenis = () => {
  useEffect(() => {
    // Initialize a new Lenis instance
    const lenis = new Lenis();

    // This function will be called on every animation frame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Start the animation frame loop
    requestAnimationFrame(raf);

    // This is a cleanup function that runs when the component unmounts
    return () => {
      lenis.destroy();
    };
  }, []); // The empty array ensures this effect runs only once on mount
};