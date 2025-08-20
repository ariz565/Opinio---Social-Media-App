"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PostCardSkeleton() {
  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-gray-100 dark:ring-gray-800 animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
            <Skeleton className="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
              <Skeleton className="h-4 w-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
              <Skeleton className="h-4 w-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
            </div>
            <Skeleton className="h-5 w-5 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          </div>
          <Skeleton className="h-5 w-5 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CreatePostSkeleton() {
  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-gray-100 dark:ring-gray-800 animate-pulse">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          <div className="flex-1">
            <Skeleton className="h-12 w-full rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <Skeleton className="h-8 w-16 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
            <Skeleton className="h-8 w-16 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
            <Skeleton className="h-8 w-16 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          </div>
          <Skeleton className="h-9 w-20 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
        </div>
      </CardContent>
    </Card>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Sidebar skeleton components
export function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Card Skeleton */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-gray-100 dark:ring-gray-800 animate-pulse">
        <CardContent className="p-6">
          <Skeleton className="h-24 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          <div className="relative -mt-8 mb-4">
            <Skeleton className="h-16 w-16 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
              <Skeleton className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
              <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Skeleton */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg ring-1 ring-gray-100 dark:ring-gray-800 animate-pulse">
        <CardContent className="p-4">
          <Skeleton className="h-5 w-24 mb-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
