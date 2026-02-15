"use client";

import Image from "next/image";

type AvatarProps = {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const sizePixels = {
  sm: 32,
  md: 40,
  lg: 48,
};

export function Avatar({ src, alt, size = "md" }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={sizePixels[size]}
        height={sizePixels[size]}
        className={`rounded-full object-cover ${sizeClasses[size]}`}
      />
    );
  }

  const initials = alt
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 ${sizeClasses[size]}`}
      aria-label={alt}
    >
      {initials}
    </div>
  );
}
