"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function HomeHeroBackground({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [landscapeImages, setLandscapeImages] = useState<string[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    Promise.all(images.map((src) => new Promise<string | null>((resolve) => {
      const image = new window.Image();
      image.onload = () => resolve(image.naturalWidth / image.naturalHeight >= 1.2 ? src : null);
      image.onerror = () => resolve(null);
      image.src = src;
    }))).then((results) => {
      if (!cancelled) {
        setLandscapeImages(results.filter((src): src is string => Boolean(src)));
        setActiveIndex(0);
      }
    });
    return () => { cancelled = true; };
  }, [images]);

  useEffect(() => {
    if (landscapeImages.length < 2 || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % landscapeImages.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [landscapeImages.length, reduceMotion]);

  if (landscapeImages.length === 0) return null;

  return (
    <div className="absolute inset-0">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={landscapeImages[activeIndex]}
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 } }}
        >
          <motion.img
            src={landscapeImages[activeIndex]}
            alt="BCN creatives gathered at a previous event"
            className="absolute inset-0 h-full w-full object-cover object-[center_42%] sm:object-center"
            initial={{ scale: 1.01 }}
            animate={{ scale: reduceMotion ? 1.01 : 1.055 }}
            transition={{ duration: 7, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
