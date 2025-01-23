"use client";

import { Bell, MessageSquare, Moon, Search, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import Link from "next/link";
import { ProfileMenu } from "./profile-menu";
import { SearchBar } from "../search/search-bar";
import Image from "next/image"; // Import the Image component

export default function Navbar() {
  const { setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          {/* Replace the Home icon and Gulf Return text with the logo */}
          <Image
            src="https://raw.githubusercontent.com/ariz565/Learning---AI-ML/refs/heads/main/gulf_eturn_logo-removebg-preview.png?token=GHSAT0AAAAAACPVIOCEQFX44NXCYI4FP3FEZ4SS5DQ"
            alt="Gulf Return Logo"
            width={32}
            height={32}
            className="h-20 w-20" // Adjust the size as needed
          />
        </Link>

        <div className="flex items-center gap-4 ml-auto">
          <div className="relative w-64">
            {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8" /> */}
            <SearchBar />
          </div>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>

          <ProfileMenu />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
