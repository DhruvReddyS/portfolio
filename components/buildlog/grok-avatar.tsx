"use client";

import { createAvatar } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import definition from "@/lib/grok-bot.avatar.json";

/**
 * The avatar package validates its JSON definition with Ajv, which compiles
 * the schema with `new Function`. The Cloudflare Workers runtime forbids that,
 * so this module is only ever loaded in the browser (see `grok.tsx`, which
 * pulls it in with `ssr: false`).
 */
const Avatar = createAvatar(definition);

export type GrokAnimation = keyof typeof definition.animations;
export type GrokExpression = keyof typeof definition.expressions;

export type GrokAvatarProps = {
  animation?: GrokAnimation;
  expression?: GrokExpression;
  size?: number | string;
  ariaLabel?: string;
};

export default function GrokAvatar({
  animation,
  expression,
  size = "100%",
  ariaLabel = "",
}: GrokAvatarProps) {
  return (
    <Avatar
      {...(expression ? { expression } : { animation: animation ?? "idle" })}
      size={size}
      ariaLabel={ariaLabel}
    />
  );
}
