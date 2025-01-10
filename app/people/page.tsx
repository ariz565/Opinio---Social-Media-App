'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function PeoplePage() {
  // Mock data - replace with real API call
  const people = [
    {
      name: 'Alice Johnson',
      username: 'alicej',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      title: 'UX Designer at Design Co',
      mutualConnections: 12,
    },
    {
      name: 'Michael Chen',
      username: 'michaelc',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      title: 'Software Engineer at Tech Corp',
      mutualConnections: 8,
    },
    {
      name: 'Sarah Williams',
      username: 'sarahw',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      title: 'Product Manager at Startup Inc',
      mutualConnections: 15,
    },
    // Add more people...
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">People You May Know</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search people..." className="pl-10" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => (
          <Card key={person.username} className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={person.image} />
                <AvatarFallback>{person.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{person.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  @{person.username}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {person.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {person.mutualConnections} mutual connections
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full">Connect</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}