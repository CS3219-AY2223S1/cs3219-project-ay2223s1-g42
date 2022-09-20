import { useEffect, useState } from "react";

const SCROLL_HIDE_THRESHOLD = 25;

export enum ScrollDir {
  NONE = "none",
  UP = "up",
  DOWN = "down",
}

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<ScrollDir>(ScrollDir.NONE);

  useEffect(() => {
    const threshold = SCROLL_HIDE_THRESHOLD;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        // ignore tiny scroll movements
        ticking = false;
        return;
      }
      // update current scroll dir based on diff
      // between current and previous scroll values
      const currentScrollDir =
        scrollY > lastScrollY ? ScrollDir.DOWN : ScrollDir.UP;
      setScrollDir(currentScrollDir);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        // update scroll dir on next available frame
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDir]);

  return scrollDir;
}
