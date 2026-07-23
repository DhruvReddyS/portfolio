"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface CylinderCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: CarouselImage[];
  containerClassName?: string;
  cardClassName?: string;
  animationDuration?: number;
  cardWidth?: number;
}

export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  (
    {
      images,
      className,
      containerClassName,
      cardClassName,
      animationDuration = 32,
      cardWidth = 250,
      ...props
    },
    ref,
  ) => {
    const customStyle = {
      "--n": images.length,
      "--w": `${cardWidth}px`,
      "--ba": "calc(1turn / var(--n))",
      "--anim-dur": `${animationDuration}s`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(
          "grid h-full min-h-[500px] w-full place-items-center overflow-hidden",
          className,
        )}
        style={{
          perspective: "35em",
          maskImage: "linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
        }}
        {...props}
      >
        <div
          className={cn(
            "grid place-items-center [transform-style:preserve-3d] motion-reduce:!animate-none",
            containerClassName,
          )}
          style={{ ...customStyle, animation: "cylinder-rotate var(--anim-dur) linear infinite" }}
        >
          <style>
            {`
              @keyframes cylinder-rotate {
                to { transform: rotateY(1turn); }
              }
            `}
          </style>
          {images.map((image, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${image.src}-${index}`}
              src={image.src}
              alt={image.alt || `Carousel image ${index + 1}`}
              className={cn(
                "[grid-area:1/1] rounded-2xl object-cover [backface-visibility:hidden]",
                cardClassName,
              )}
              style={{
                width: "var(--w)",
                aspectRatio: "7/10",
                "--i": index,
                transform:
                  "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    );
  },
);

CylinderCarousel.displayName = "CylinderCarousel";

export default CylinderCarousel;
