"use client";

import { useState } from "react";

interface StudentAvatarProps {
  avatarEmoji?: string | null;
  profileImage?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// avatarEmoji is usually a short emoji character, but a real fraction of
// student records have it set to an auto-generated avatar URL (e.g. a
// DiceBear identicon) instead — rendering that as plain text produces
// garbled overlapping URL text in the UI. Anything URL-shaped is treated
// as an image, with onError falling back to a plain default icon if the
// image 404s or otherwise fails to load.
function isUrl(value?: string | null): value is string {
  return !!value && /^https?:\/\//i.test(value);
}

const sizeClasses: Record<NonNullable<StudentAvatarProps["size"]>, string> = {
  sm: "w-7 h-7 sm:w-9 sm:h-9 text-[9px] sm:text-[10px]",
  md: "w-9 h-9 text-[10px]",
  lg: "w-14 h-14 text-lg",
};

export function StudentAvatar({ avatarEmoji, profileImage, size = "sm", className = "" }: StudentAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const imageSrc = isUrl(profileImage) ? profileImage : isUrl(avatarEmoji) ? avatarEmoji : null;
  const base = `rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold flex items-center justify-center shrink-0 overflow-hidden ${sizeClasses[size]} ${className}`;

  if (imageSrc && !imageFailed) {
    return (
      <div className={base}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  const fallbackGlyph = avatarEmoji && !isUrl(avatarEmoji) ? avatarEmoji : "👤";
  return <div className={base}>{fallbackGlyph}</div>;
}
