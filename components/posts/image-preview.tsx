'use client';

import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
}

export function ImagePreview({ src, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <img src={src} alt="Upload preview" className="w-full h-48 object-cover" />
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}