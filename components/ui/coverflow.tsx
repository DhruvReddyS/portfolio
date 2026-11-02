"use client";

import * as React from "react";
import { A11y, EffectCoverflow, Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

/**
 * A coverflow rack. The one facing you is the one you are looking at, and
 * pressing it opens it; pressing one to the side brings it round first.
 *
 * Adapted from the Skiper 49 carousel. What changed: the eleven images from
 * a CDN are gone and a slide's face is whatever the caller renders, so this
 * site can put a screenshot in one and a typeset panel in the next; the
 * caption lives outside the rack and is the caller's business, because the
 * copy, the figures and the links belong to the page and not to a carousel;
 * the icon library is dropped for two inline arrows; and it is driven by
 * keyboard as well as by hand.
 */

export type CoverflowSlide = {
  key: string;
  /** Whatever fills the face of the card. */
  cover: React.ReactNode;
  /** Spoken name for the slide. */
  label?: string;
};

export interface CoverflowProps {
  slides: CoverflowSlide[];
  /** Fires with the index now facing the reader. */
  onActivate?: (index: number) => void;
  /** Pressing the slide already facing the reader. */
  onOpen?: (index: number) => void;
  /** Width of a card in px. It shrinks on narrow screens. */
  cardWidth?: number;
  className?: string;
  ariaLabel?: string;
}

const Arrow = ({ back = false }: { back?: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d={back ? "M10 3 5 8l5 5" : "m6 3 5 5-5 5"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Coverflow({
  slides,
  onActivate,
  onOpen,
  cardWidth = 340,
  className,
  ariaLabel = "Carousel",
}: CoverflowProps) {
  const swiper = React.useRef<SwiperClass | null>(null);
  const hooks = React.useRef({ onActivate, onOpen });
  const [at, setAt] = React.useState(0);

  React.useEffect(() => {
    hooks.current = { onActivate, onOpen };
  });

  const n = slides.length;

  return (
    <div
      className={["bl-flow", className].filter(Boolean).join(" ")}
      style={{ ["--bl-flow-w" as string]: `${cardWidth}px` }}
    >
      <Swiper
        modules={[EffectCoverflow, Navigation, Keyboard, A11y]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop={n > 2}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true, containerMessage: ariaLabel }}
        coverflowEffect={{
          rotate: 34,
          stretch: 0,
          depth: 120,
          modifier: 1,
          slideShadows: true,
        }}
        onSwiper={(instance) => {
          swiper.current = instance;
        }}
        onSlideChange={(instance) => {
          setAt(instance.realIndex);
          hooks.current.onActivate?.(instance.realIndex);
        }}
        onClick={(instance) => {
          const clicked = instance.clickedIndex;
          if (clicked == null) return;
          // the card already facing you opens; the others come round first
          if (clicked === instance.activeIndex) hooks.current.onOpen?.(instance.realIndex);
          else instance.slideTo(clicked);
        }}
        className="bl-flow-rack"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.key} className="bl-flow-slide">
            <div className="bl-flow-face">{slide.cover}</div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="bl-flow-controls">
        <button
          type="button"
          className="bl-flow-btn"
          aria-label="Previous"
          onClick={() => swiper.current?.slidePrev()}
        >
          <Arrow back />
        </button>

        <ol className="bl-flow-dots" aria-hidden="true">
          {slides.map((slide, i) => (
            <li key={slide.key} data-on={i === at ? "true" : undefined}>
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => swiper.current?.slideToLoop(i)}
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="bl-flow-btn"
          aria-label="Next"
          onClick={() => swiper.current?.slideNext()}
        >
          <Arrow />
        </button>
      </div>
    </div>
  );
}

export default Coverflow;
