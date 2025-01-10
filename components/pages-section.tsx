'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus, Users } from 'lucide-react';

const suggestedPages = [
  {
    name: 'Tech Enthusiasts',
    members: '45.2K members',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
  },
  {
    name: 'Digital Artists',
    members: '28.9K members',
    image: 'https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07',
  },
  {
    name: 'Startup Hub',
    members: '15.7K members',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
  },
];

export function PagesSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pages You Might Like
            </span>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Page
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedPages.map((page, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={page.image}
                alt={page.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{page.name}</h4>
                <p className="text-sm text-muted-foreground">{page.members}</p>
              </div>
              <Button variant="secondary" size="sm">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}