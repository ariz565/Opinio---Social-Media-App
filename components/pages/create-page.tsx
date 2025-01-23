"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ImageUploader } from "../profile/image-uploader";
import { Plus, Upload } from "lucide-react";

interface CreatePageProps {
  onCreatePage: (pageData: any) => void;
}

export function CreatePage({ onCreatePage }: CreatePageProps) {
  const [showCoverUploader, setShowCoverUploader] = useState(false);
  const [showProfileUploader, setShowProfileUploader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    coverImage: "",
    profileImage: "",
  });

  const categories = [
    "Business",
    "Entertainment",
    "Education",
    "Technology",
    "Community",
    "Nonprofit",
    "Other",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePage(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create Page
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Page</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div
              className="relative h-40 bg-muted rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setShowCoverUploader(true)}
            >
              {formData.coverImage ? (
                <img
                  src={formData.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Image */}
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <div
              className="relative h-24 w-24 bg-muted rounded-full overflow-hidden cursor-pointer mx-auto"
              onClick={() => setShowProfileUploader(true)}
            >
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Page Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Page Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your page name"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Tell people what your page is about"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button type="submit">Create Page</Button>
          </div>
        </form>

        {/* Image Uploaders */}
        <ImageUploader
          open={showCoverUploader}
          onClose={() => setShowCoverUploader(false)}
          onUpload={(url) => {
            setFormData({ ...formData, coverImage: url });
            setShowCoverUploader(false);
          }}
          aspectRatio={2.5}
          title="Upload Cover Image"
        />
        <ImageUploader
          open={showProfileUploader}
          onClose={() => setShowProfileUploader(false)}
          onUpload={(url) => {
            setFormData({ ...formData, profileImage: url });
            setShowProfileUploader(false);
          }}
          aspectRatio={1}
          title="Upload Profile Image"
        />
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
}
