"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "😉",
    "😌",
  ],
  gestures: ["👍", "👎", "👊", "✊", "🤛", "🤜", "🤝", "👏", "🙌", "👐", "🤲"],
  symbols: [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🤎",
    "🖤",
    "🤍",
    "💯",
    "✨",
    "💫",
  ],
};

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [category, setCategory] = useState("smileys");

  return (
    <Card className="w-64 p-2">
      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="w-full">
          <TabsTrigger value="smileys">😀</TabsTrigger>
          <TabsTrigger value="gestures">👍</TabsTrigger>
          <TabsTrigger value="symbols">❤️</TabsTrigger>
        </TabsList>
      </Tabs>
      <ScrollArea className="h-48 mt-2">
        <div className="grid grid-cols-6 gap-1">
          {EMOJI_CATEGORIES[category as keyof typeof EMOJI_CATEGORIES].map(
            (emoji, index) => (
              <button
                key={index}
                className="p-1 hover:bg-muted rounded"
                onClick={() => onSelect(emoji)}
              >
                {emoji}
              </button>
            )
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
