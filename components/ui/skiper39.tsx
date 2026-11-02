"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

/**
 * A crowd of people walking across the foot of the canvas, drawn from one
 * sprite sheet.
 *
 * Changed from the component as it shipped:
 *  - the sheet is served from this site rather than from a third-party CDN,
 *    because the colophon promises no third-party requests and meant it
 *  - typed, instead of `any` through the middle of it
 *  - it stops when it is not on screen; this page is ten thousand pixels long
 *    and a hundred and five tweens have no business running at the top of it
 *  - the walk is reseeded on resize rather than restarted from nothing
 */

type Peep = {
  image: HTMLImageElement;
  rect: number[];
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
  setRect: (rect: number[]) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
};

type Stage = { width: number; height: number };

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
}

const CrowdCanvas = ({ src, rows = 15, cols = 7, className }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
    const randomIndex = <T,>(array: T[]) => randomRange(0, array.length) | 0;
    const removeFromArray = <T,>(array: T[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = <T,>(array: T[], item: T) => removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = <T,>(array: T[]) => removeFromArray(array, randomIndex(array));
    const getRandomFromArray = <T,>(array: T[]) => array[randomIndex(array) | 0];

    const resetPeep = ({ stage, peep }: { stage: Stage; peep: Peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    };

    const normalWalk = ({ peep, props }: { peep: Peep; props: { startX: number; startY: number; endX: number } }) => {
      const { startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0);
      tl.to(peep, { duration: yDuration, repeat: xDuration / yDuration, yoyo: true, y: startY - 10 }, 0);
      return tl;
    };

    const walks = [normalWalk];

    const createPeep = ({ image, rect }: { image: HTMLImageElement; rect: number[] }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (next: number[]) => {
          peep.rect = next;
          peep.width = next[2];
          peep.height = next[3];
        },
        render: (target: CanvasRenderingContext2D) => {
          target.save();
          target.translate(peep.x, peep.y);
          target.scale(peep.scaleX, 1);
          target.drawImage(peep.image, peep.rect[0], peep.rect[1], peep.rect[2], peep.rect[3], 0, 0, peep.width, peep.height);
          target.restore();
        },
      };
      peep.setRect(rect);
      return peep;
    };

    const img = document.createElement("img");
    const stage: Stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    let started = false;

    const createPeeps = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;
      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [(i % rows) * rectWidth, ((i / rows) | 0) * rectHeight, rectWidth, rectHeight],
          }),
        );
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({ peep, stage }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });
      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const initCrowd = () => {
      while (availablePeeps.length) addPeepToCrowd().walk?.progress(Math.random());
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);
      crowd.forEach((peep) => peep.render(ctx));
      ctx.restore();
    };

    const resize = () => {
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;
      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);
      initCrowd();
    };

    const init = () => {
      if (started) return;
      started = true;
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;

    const handleResize = () => { if (started) resize(); };
    window.addEventListener("resize", handleResize);

    /*
     * Ten thousand pixels of page sit above this. The sheet is most of a
     * megabyte and the crowd is a hundred and five tweens, and neither has any
     * business starting while the reader is still at the top: the sheet is not
     * fetched until the section is nearly in view, and the walk stops again
     * whenever it leaves.
     */
    const io = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && !img.src) {
            img.src = src;
            if (img.complete && img.naturalWidth) init();
          }
          crowd.forEach((peep) => { if (peep.walk) peep.walk.paused(!entry.isIntersecting); });
          if (entry.isIntersecting) gsap.ticker.add(render);
          else gsap.ticker.remove(render);
        }, { rootMargin: "600px" })
      : null;

    if (io) io.observe(canvas);
    else { img.src = src; }         // no observer: fall back to loading it now

    return () => {
      window.removeEventListener("resize", handleResize);
      io?.disconnect();
      gsap.ticker.remove(render);
      img.onload = null;
      crowd.forEach((peep) => peep.walk?.kill());
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className={className} />;
};

export { CrowdCanvas };
export default CrowdCanvas;

/**
 * Skiper 39 Canvas_Landing_004 — React + Canvas
 * Inspired by and adapted from https://codepen.io/zadvorsky/pen/xxwbBQV
 * illustration by https://www.openpeeps.com/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren't associated with the codepen.io . They're independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
