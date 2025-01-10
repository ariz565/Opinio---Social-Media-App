"use client";

import { Button } from "../ui/button";
import { Users, Building2, MapPin } from "lucide-react";

export function SearchFilters() {
  return (
    <div className="flex gap-2 p-2 border-b">
      <Button variant="ghost" size="sm" className="gap-2">
        <Users className="h-4 w-4" />
        People
      </Button>
      <Button variant="ghost" size="sm" className="gap-2">
        <Building2 className="h-4 w-4" />
        Companies
      </Button>
      <Button variant="ghost" size="sm" className="gap-2">
        <MapPin className="h-4 w-4" />
        Locations
      </Button>
    </div>
  );
}
