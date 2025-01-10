'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Eye, TrendingUp, Users } from 'lucide-react';
import { Button } from '../ui/button';

interface ProfileAnalyticsProps {
  isPrivate?: boolean;
}

export function ProfileAnalytics({ isPrivate }: ProfileAnalyticsProps) {
  const analytics = {
    profileViews: 152,
    postImpressions: 1234,
    searchAppearances: 45,
  };

  if (isPrivate) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analytics</CardTitle>
        <p className="text-sm text-muted-foreground">Private to you</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{analytics.profileViews} profile views</p>
            <p className="text-sm text-muted-foreground">Discover who's viewed your profile</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{analytics.postImpressions} post impressions</p>
            <p className="text-sm text-muted-foreground">Check out who's engaging with your posts</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{analytics.searchAppearances} search appearances</p>
            <p className="text-sm text-muted-foreground">See how often you appear in search results</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}