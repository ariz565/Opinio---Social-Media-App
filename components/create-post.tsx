"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import {
  ImagePlus,
  Loader2,
  Hash,
  MapPin,
  Globe,
  Users,
  UserCheck,
  Lock,
  Video,
  Smile,
  Settings,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { postsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CreatePostProps {
  onPostCreated?: () => void;
  user?: any;
  className?: string;
  variant?: "compact" | "expanded";
}

export function CreatePost({
  onPostCreated,
  user,
  className,
  variant = "compact",
}: CreatePostProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<
    "public" | "followers" | "close_friends" | "private"
  >("public");
  const [allowComments, setAllowComments] = useState(true);
  const [allowShares, setAllowShares] = useState(true);
  const [isExpanded, setIsExpanded] = useState(variant === "expanded");
  const [showSettings, setShowSettings] = useState(false);

  // New state for media, feelings, and location
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [feeling, setFeeling] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [showFeelingPopover, setShowFeelingPopover] = useState(false);
  const [showLocationPopover, setShowLocationPopover] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get user from localStorage if not provided
  const currentUser = user || JSON.parse(localStorage.getItem("user") || "{}");

  // Common feelings/moods
  const feelings = [
    "😊 Happy",
    "😢 Sad",
    "😍 Loved",
    "😤 Frustrated",
    "🎉 Excited",
    "😴 Tired",
    "🤔 Thoughtful",
    "😎 Cool",
    "🥳 Celebrating",
    "💪 Motivated",
    "😂 Funny",
    "🙏 Grateful",
    "😌 Peaceful",
    "🔥 Inspired",
    "❤️ Blessed",
  ];

  const visibilityOptions = {
    public: { icon: Globe, label: "Public", desc: "Anyone can see" },
    followers: { icon: Users, label: "Followers", desc: "Only followers" },
    close_friends: {
      icon: UserCheck,
      label: "Close Friends",
      desc: "Selected friends",
    },
    private: { icon: Lock, label: "Private", desc: "Only you" },
  };

  const extractHashtags = (text: string) => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = text.match(hashtagRegex);
    const uniqueHashtags = matches
      ? Array.from(new Set(matches.map((tag) => tag.slice(1))))
      : [];
    setHashtags(uniqueHashtags);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    extractHashtags(value);

    // Auto-expand textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFocus = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  // Media handling functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 4) {
      toast({
        title: "Too many files",
        description: "You can only upload up to 4 media files.",
        variant: "destructive",
      });
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
    setIsExpanded(true);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleVideoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "video/*";
      fileInputRef.current.click();
    }
  };

  const handleFeelingSelect = (selectedFeeling: string) => {
    setFeeling(selectedFeeling);
    setShowFeelingPopover(false);
    setIsExpanded(true);
  };

  const removeFeling = () => {
    setFeeling("");
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setShowLocationPopover(false);
    setIsExpanded(true);
  };

  const removeLocation = () => {
    setLocation("");
  };

  const handlePost = async () => {
    if (!content.trim() && selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please write something or select media before posting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Determine post type based on selected files
      const postType: "text" | "image" | "video" =
        selectedFiles.length > 0
          ? selectedFiles[0].type.startsWith("video/")
            ? "video"
            : "image"
          : "text";

      if (selectedFiles.length > 0) {
        // Create post with media using the unified endpoint
        const postData = {
          content: content.trim(),
          post_type: postType,
          hashtags,
          visibility,
          allow_comments: allowComments,
          allow_shares: allowShares,
          // Add mood/feeling if selected
          ...(feeling && { mood_activity: feeling }),
          // Add location if selected
          ...(location && {
            location: {
              name: location,
            },
          }),
        };

        await postsAPI.createPostWithMedia(selectedFiles, postData);
      } else {
        // Create text post without media
        const postData = {
          content: content.trim(),
          hashtags,
          visibility,
          allow_comments: allowComments,
          allow_shares: allowShares,
          post_type: "text" as "text" | "image" | "video",
          // Add mood/feeling if selected
          ...(feeling && { mood_activity: feeling }),
          // Add location if selected
          ...(location && {
            location: {
              name: location,
            },
          }),
        };

        await postsAPI.createPost(postData);
      }

      // Clear all fields
      setContent("");
      setHashtags([]);
      setSelectedFiles([]);
      setFeeling("");
      setLocation("");
      setIsExpanded(false);

      toast({
        title: "Success",
        description: "Your post has been shared!",
      });

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const VisibilityIcon = visibilityOptions[visibility].icon;

  return (
    <Card
      className={cn(
        "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <CardContent className="p-6">
        {/* Header with Avatar and Input */}
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 border-2 border-white shadow-lg ring-2 ring-gray-100 dark:ring-gray-700">
            <AvatarImage src={currentUser?.profile_picture || ""} />
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold text-lg">
              {currentUser?.full_name?.charAt(0)?.toUpperCase() ||
                currentUser?.username?.charAt(0)?.toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              placeholder={`What's on your mind, ${
                currentUser?.first_name || currentUser?.username || "friend"
              }?`}
              value={content}
              onChange={handleContentChange}
              onFocus={handleFocus}
              className={cn(
                "border-0 bg-gray-50 dark:bg-gray-800 resize-none p-4 text-lg placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 rounded-xl transition-all duration-200",
                isExpanded ? "min-h-[120px]" : "min-h-[60px]"
              )}
              disabled={isLoading}
              maxLength={500}
            />

            {/* Character count */}
            {isExpanded && (
              <div className="flex justify-between items-center mt-2">
                <div className="flex-1">
                  {/* Hashtags Display */}
                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
                        >
                          <Hash className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500 ml-4">
                  {content.length}/500
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className="mt-6 space-y-4">
            <Separator className="bg-gray-200 dark:bg-gray-700" />

            {/* Media and Options Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePhotoClick}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl"
                >
                  <ImagePlus className="w-5 h-5 mr-2" />
                  Photo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVideoClick}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Video
                </Button>

                <Popover
                  open={showFeelingPopover}
                  onOpenChange={setShowFeelingPopover}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl"
                    >
                      <Smile className="w-5 h-5 mr-2" />
                      Feeling
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <h4 className="font-semibold text-sm mb-3">
                      How are you feeling?
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {feelings.map((feeling) => (
                        <Button
                          key={feeling}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeelingSelect(feeling)}
                          className="text-left justify-start text-xs h-auto py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {feeling}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover
                  open={showLocationPopover}
                  onOpenChange={setShowLocationPopover}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                    >
                      <MapPin className="w-5 h-5 mr-2" />
                      Location
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <h4 className="font-semibold text-sm mb-3">Add location</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Search for a place..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleLocationChange(e.currentTarget.value);
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500">
                        Press Enter to add location
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Popover open={showSettings} onOpenChange={setShowSettings}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">Post Settings</h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Allow comments</span>
                        <Switch
                          checked={allowComments}
                          onCheckedChange={setAllowComments}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Allow shares</span>
                        <Switch
                          checked={allowShares}
                          onCheckedChange={setAllowShares}
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Select media files"
            />

            {/* Selected Files Display */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected Media ({selectedFiles.length}/4)
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        {file.type.startsWith("image/") ? (
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-8 h-8 text-gray-500" />
                            <span className="ml-2 text-sm text-gray-500">
                              {file.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Feeling Display */}
            {feeling && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Feeling:
                </span>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                >
                  {feeling}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={removeFeling}
                    className="ml-2 w-4 h-4 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full"
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </Badge>
              </div>
            )}

            {/* Selected Location Display */}
            {location && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Location:
                </span>
                <Badge
                  variant="secondary"
                  className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {location}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={removeLocation}
                    className="ml-2 w-4 h-4 hover:bg-red-200 dark:hover:bg-red-800 rounded-full"
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </Badge>
              </div>
            )}

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between">
              <Select
                value={visibility}
                onValueChange={(value: any) => setVisibility(value)}
              >
                <SelectTrigger className="w-auto border-0 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-2">
                    <VisibilityIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {visibilityOptions[visibility].label}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(visibilityOptions).map(([key, option]) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">
                              {option.desc}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setContent("");
                    setHashtags([]);
                    setIsExpanded(false);
                  }}
                  className="text-gray-600 hover:text-gray-700 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePost}
                  disabled={!content.trim() || isLoading}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white rounded-xl px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
