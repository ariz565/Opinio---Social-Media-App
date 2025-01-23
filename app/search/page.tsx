"use client";

import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProfileCard } from "@/components/sidebar/left-sidebar.tsx/profile-card";
import { PagesSection } from "@/components/sidebar/left-sidebar.tsx/pages-section";
import { TrendingCard } from "@/components/sidebar/right-sidebar.tsx/trending-card";
import { ChatSystem } from "@/components/chat/chat-system";
import { Footer } from "@/components/footer/footer";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // Mock search results - replace with real API data
  const results = [
    {
      id: "1",
      name: "John Smith",
      username: "johnsmith",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      position: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
    },
    {
      id: "2",
      name: "John Davis",
      username: "johndavis",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      position: "Product Designer",
      company: "Design Co",
      location: "New York, NY",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-6 space-y-6">
              <ProfileCard />
              {/* <PagesSection /> */}
            </div>
          </div>

          {/* Main Content - Search Results */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold mb-6">
              Search Results for &ldquo;{query}&rdquo;
            </h1>
            <div className="grid gap-4">
              {results.map((user) => (
                <Card key={user.id} className="p-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.image} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{user.name}</h2>
                      <p className="text-muted-foreground">
                        {user.position} at {user.company}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.location}
                      </p>
                    </div>
                    <Link href={`/profile/${user.username}`}>
                      <Button>View Profile</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-6 space-y-6">
              <TrendingCard />
              <ChatSystem />
              {/* Footer */}
              <div className="mt-8">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
