"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader2, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  // Mock results - replace with real data
  const results = [
    {
      type: "user",
      name: "Sarah Wilson",
      username: "sarahw",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      location: "San Francisco, CA",
      position: "Product Designer",
      company: "Design Co",
    },
    {
      type: "company",
      name: "Tech Corp",
      image: "https://images.unsplash.com/photo-1496200186974-4293800e2c20",
      location: "New York, NY",
      industry: "Technology",
    },
  ];

  return (
    <div className="py-2 max-h-[400px] overflow-y-auto">
      {query && (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          Showing results for "{query}"
        </div>
      )}

      <div className="space-y-1">
        {results.map((result, index) => (
          <Link
            key={index}
            href={result.type === "user" ? `/profile/${result.username}` : "#"}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={result.image} />
              <AvatarFallback>{result.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="font-medium">{result.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                {result.type === "user" ? (
                  <>
                    <Briefcase className="h-3 w-3" />
                    <span>
                      {result.position} at {result.company}
                    </span>
                  </>
                ) : (
                  <>
                    <span>{result.industry}</span>
                  </>
                )}
                <span>•</span>
                <MapPin className="h-3 w-3" />
                <span>{result.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
