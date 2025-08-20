"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreatePost } from "@/components/create-post";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const CreatePostModal = ({
  isOpen,
  onClose,
  user,
}: CreatePostModalProps) => {
  const handlePostCreated = () => {
    onClose(); // Close modal after successful post creation
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>
        <CreatePost
          user={user}
          onPostCreated={handlePostCreated}
          className="border-0"
        />
      </DialogContent>
    </Dialog>
  );
};
