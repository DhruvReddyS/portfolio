/**
 * The widths the image endpoint will answer to.
 *
 * Both optimisers, vinext's and Vercel's, validate the requested width
 * against a fixed list and answer 400 to anything else. An <Image> given a
 * file's own pixel width asks for exactly that width, so a 949px wordmark
 * declared honestly is a 400 and a missing logo.
 *
 * These are Next.js's own defaults, which vinext takes unchanged.
 * `scripts/vercel-build.mjs` checks this list against vinext's at build time
 * and fails the build if the two ever drift apart.
 */
export const IMAGE_WIDTHS = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
] as const;

/**
 * A file's real size, rounded up to a width the optimiser will serve.
 *
 * The aspect ratio is kept, so the box the image reserves is still the right
 * shape; only the number handed to the optimiser changes. Anything larger
 * than the biggest allowed width is left alone, since the endpoint clamps it.
 */
export function servable(width: number, height: number) {
  const fits = IMAGE_WIDTHS.find((allowed) => allowed >= width);
  if (!fits || fits === width) return { width, height };
  return { width: fits, height: Math.round((height * fits) / width) };
}
