"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface ProfilePhotoUploadProps {
  type: "profile" | "cover";
  onUpload: (file: File) => void;
  className?: string;
}

export function ProfilePhotoUpload({
  type,
  onUpload,
  className = "",
}: ProfilePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={triggerFileSelect}
        className="flex items-center gap-2"
      >
        <Camera className="h-4 w-4" />
        {type === "profile" ? "Change Photo" : "Change Cover"}
      </Button>
    </div>
  );
}
