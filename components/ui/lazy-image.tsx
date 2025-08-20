"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  aspectRatio?: "square" | "video" | "auto";
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  className,
  fill = false,
  aspectRatio = "auto",
  priority = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Auto-enable fill when aspectRatio is set (indicates container has fixed dimensions)
  const shouldUseFill = fill || aspectRatio !== "auto";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      default:
        return "";
    }
  };

  const containerClasses = cn(
    "relative overflow-hidden bg-gray-100 dark:bg-gray-800 transition-all duration-300",
    getAspectClass(),
    className
  );

  if (hasError) {
    return (
      <div ref={imgRef} className={containerClasses}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Failed to load image
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={containerClasses}>
      {/* Loading skeleton */}
      {!isLoaded && (isInView || priority) && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      )}

      {/* Actual image */}
      {(isInView || priority) && (
        <Image
          src={src}
          alt={alt}
          fill={shouldUseFill}
          className={cn(
            "object-cover transition-all duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          priority={priority}
        />
      )}

      {/* Overlay for loading state */}
      {!isLoaded && (isInView || priority) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
