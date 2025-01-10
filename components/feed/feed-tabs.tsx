"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { InfiniteFeed } from "./infinite-feed";
import { CreatePost } from "@/components/posts/create-post";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function FeedTabs() {
  const [sortBy, setSortBy] = useState<"top" | "recent">("top");
  const [activeTab, setActiveTab] = useState<"following" | "explore">(
    "following"
  );

  return (
    <div className="space-y-6">
      <CreatePost />

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Tabs
            value={activeTab}
            onValueChange={(value: "following" | "explore") =>
              setActiveTab(value)
            }
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-4">
                {sortBy === "top" ? "Top Posts" : "Recent Posts"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("top")}>
                Top Posts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("recent")}>
                Recent Posts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <InfiniteFeed type={activeTab} sortBy={sortBy} />
      </div>
    </div>
  );
}
