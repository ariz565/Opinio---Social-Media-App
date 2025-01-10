"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { ImagePlus, Loader2, Smile, Globe, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ContentEditor } from "./content-editor";
import { ImagePreview } from "./image-preview";
import { EmojiPicker } from "./emoji-picker";
import { PostPrivacySelect } from "./post-privacy-select";

export function CreatePost() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [privacy, setPrivacy] = useState<"public" | "connections" | "private">(
    "public"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return;

    setIsLoading(true);
    // TODO: Implement post creation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setContent("");
    setImages([]);
    setIsLoading(false);
  };

  return (
    <Card className="border-0 border-b rounded-none">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <ContentEditor
              value={content}
              onChange={setContent}
              placeholder="What's on your mind?"
              maxLength={500}
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, index) => (
                  <ImagePreview
                    key={index}
                    src={img}
                    onRemove={() => removeImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-5 w-5" />
            </Button>
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2">
                <EmojiPicker
                  onSelect={(emoji) => {
                    setContent((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {content.length}/500
            </span>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (!content.trim() && images.length === 0)}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full">
          <PostPrivacySelect value={privacy} onChange={setPrivacy} />
        </div>
      </CardFooter>
    </Card>
  );
}
