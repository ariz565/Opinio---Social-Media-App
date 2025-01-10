"use client";

import { useState, useEffect } from "react";
import { Search, Clock, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const MAX_RECENT_SEARCHES = 5;

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (search: string) => {
    const updated = [
      search,
      ...recentSearches.filter((s) => s !== search),
    ].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    saveSearch(searchQuery.trim());
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setIsOpen(false);
    setQuery("");
  };

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search people, companies..."
          className="pl-8 pr-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query);
            }
          }}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50">
          {recentSearches.length > 0 && (
            <div className="p-2">
              <div className="text-sm font-medium text-muted-foreground px-2 py-1">
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer"
                  onClick={() => handleSearch(search)}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{search}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(search);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
