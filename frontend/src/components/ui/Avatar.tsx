import React, { useState } from 'react';

/**
 * Props for the Avatar component.
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source URL of the profile image */
  src?: string;
  /** Alternate text for accessibility screen readers */
  alt?: string;
  /** Fallback text (e.g. initials "JD") when the image is missing or failing */
  fallback?: string;
  /** Size multiplier of the avatar frame */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Avatar - Reusable circular profile image display.
 * Includes support for sizing classes, lazy loaded images, and visual letter fallbacks.
 *
 * @example
 * <Avatar src={profilePhoto} alt="John Doe" fallback="JD" size="md" />
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className = '',
      src,
      alt = 'Avatar photo',
      fallback = '?',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
      sm: 'w-8 h-8 text-tiny',
      md: 'w-10 h-10 text-small font-medium',
      lg: 'w-14 h-14 text-body font-semibold',
    };

    const hasImage = src && !imageError;

    return (
      <div
        ref={ref}
        className={`
          relative flex shrink-0 overflow-hidden rounded-radius-pill select-none items-center justify-center bg-slate-100 dark:bg-slate-800 text-neutral-textSub border border-neutral-borderLine dark:border-slate-800
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {hasImage ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="uppercase tracking-wider text-neutral-textMain dark:text-slate-200"
            aria-label={alt}
          >
            {fallback.substring(0, 2)}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
