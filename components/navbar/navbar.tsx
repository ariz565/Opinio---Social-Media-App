"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-provider";
import {
  Search,
  Bell,
  MessageCircle,
  UserIcon,
  Settings,
  LogOut,
  Home,
  Users,
  Briefcase,
  Menu,
  X,
  TrendingUp,
  Hash,
  BookOpen,
} from "lucide-react";
import { isAuthenticated, getCurrentUser, authAPI, type User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Search suggestions data
const searchSuggestions = [
  { text: "professionals in Dubai", icon: Users },
  { text: "remote work opportunities", icon: Briefcase },
  { text: "software engineer jobs", icon: TrendingUp },
  { text: "#TechCareers", icon: Hash },
  { text: "#DubaiJobs", icon: Hash },
  { text: "networking events", icon: Users },
];

export const Navbar = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const placeholderTexts = useMemo(
    () => [
      "Search professionals...",
      "Find job opportunities...",
      "Explore trending topics...",
      "Connect with people...",
      "Discover companies...",
    ],
    []
  );

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      if (authenticated) {
        setCurrentUser(getCurrentUser());
      } else {
        setCurrentUser(null);
      }
    };

    // Initial check
    checkAuth();

    // Listen for auth changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event listener for manual auth updates
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, []);

  // Typing animation for search placeholder
  useEffect(() => {
    const currentText = placeholderTexts[currentPlaceholder];
    let index = 0;

    const typeText = () => {
      if (index <= currentText.length) {
        setDisplayText(currentText.slice(0, index));
        index++;
        typingTimeoutRef.current = setTimeout(typeText, 100);
      } else {
        // Wait before starting to delete
        typingTimeoutRef.current = setTimeout(() => {
          const deleteText = () => {
            if (index > 0) {
              setDisplayText(currentText.slice(0, index));
              index--;
              typingTimeoutRef.current = setTimeout(deleteText, 50);
            } else {
              // Move to next placeholder
              setCurrentPlaceholder(
                (prev) => (prev + 1) % placeholderTexts.length
              );
            }
          };
          deleteText();
        }, 2000);
      }
    };

    if (!isSearchFocused) {
      typeText();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentPlaceholder, isSearchFocused, placeholderTexts]);

  // Click outside to close search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsAuth(false);
      setCurrentUser(null);

      await authAPI.logout();

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // Redirect is handled in the API logout function
    } catch (error) {
      console.error("Logout error:", error);
      // Still try to clear state even if logout fails
      setIsAuth(false);
      setCurrentUser(null);
      router.push("/auth");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: isAuth ? "/feed" : "/", label: "Home", icon: Home },
    { href: "/people", label: "People", icon: Users },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/pages", label: "Pages", icon: BookOpen, requiresAuth: true },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/60 dark:border-gray-800/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div
              onClick={() => router.push(isAuth ? "/feed" : "/")}
              className="cursor-pointer flex items-center space-x-3 group"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <Image
                  src="/assets/images/gulf-return-logo.jpg"
                  alt="Gulf Return"
                  fill
                  className="object-contain rounded-xl relative z-10"
                />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent hidden sm:block group-hover:from-teal-600 group-hover:to-blue-600 dark:group-hover:from-teal-400 dark:group-hover:to-blue-400 transition-all duration-300">
                Gulf Return
              </span>
            </div>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              // Skip rendering if auth is required but user is not authenticated
              if (link.requiresAuth && !isAuth) {
                return null;
              }

              const Icon = link.icon;
              const handleClick = () => {
                if (link.requiresAuth && !isAuth) {
                  router.push("/auth");
                  return;
                }
                router.push(link.href);
              };

              return (
                <motion.div
                  key={link.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    onClick={handleClick}
                    className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 dark:text-gray-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 px-4 py-2 rounded-xl transition-all duration-200 group"
                  >
                    <Icon className="h-4 w-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                    <span className="hidden lg:block font-medium">
                      {link.label}
                    </span>
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Enhanced Search Bar with Typing Effect */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden sm:block flex-1 max-w-xl mx-8"
            ref={searchRef}
          >
            <div className="relative">
              <motion.div whileHover={{ scale: 1.02 }} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500 h-4 w-4 z-10" />
                <Input
                  type="text"
                  placeholder={
                    isSearchFocused ? "Type to search..." : displayText
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="pl-12 pr-4 py-3 bg-slate-100/80 dark:bg-gray-800/80 border-0 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 rounded-xl backdrop-blur-sm transition-all duration-300 focus:bg-white dark:focus:bg-gray-800 shadow-sm focus:shadow-md placeholder:text-slate-400 dark:placeholder:text-gray-500"
                />
                {!isSearchFocused && (
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-teal-500 rounded-full"
                  />
                )}
              </motion.div>

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-slate-200 dark:border-gray-700 backdrop-blur-xl z-50 overflow-hidden"
                  >
                    <div className="p-3">
                      <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Popular Searches
                      </p>
                      <div className="space-y-1">
                        {searchSuggestions
                          .slice(0, 5)
                          .map((suggestion, index) => {
                            const Icon = suggestion.icon;
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                onClick={() => {
                                  setSearchQuery(suggestion.text);
                                  setIsSearchFocused(false);
                                  router.push(
                                    `/search?q=${encodeURIComponent(
                                      suggestion.text
                                    )}`
                                  );
                                }}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Icon className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm text-slate-700 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                  {suggestion.text}
                                </span>
                              </motion.div>
                            );
                          })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Enhanced Right Side Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <ThemeToggle />
            </motion.div>

            {isAuth ? (
              // Enhanced Authenticated User Actions
              <>
                {/* Notifications */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <Bell className="h-5 w-5 text-slate-600 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-sm"
                    />
                  </Button>
                </motion.div>

                {/* Messages */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <MessageCircle className="h-5 w-5 text-slate-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-sm"
                    />
                  </Button>
                </motion.div>

                {/* Enhanced User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-xl p-0 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-200"
                      >
                        <Avatar className="h-9 w-9 ring-2 ring-slate-200 dark:ring-gray-700 hover:ring-teal-300 dark:hover:ring-teal-600 transition-all duration-200">
                          <AvatarImage
                            src={currentUser?.avatar_url}
                            alt={currentUser?.full_name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold text-sm">
                            {currentUser?.full_name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 mr-4 mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-slate-200 dark:border-gray-700 shadow-xl rounded-xl"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 ring-2 ring-slate-200 dark:ring-gray-700">
                          <AvatarImage
                            src={currentUser?.avatar_url}
                            alt={currentUser?.full_name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold">
                            {currentUser?.full_name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold leading-none text-slate-800 dark:text-white">
                            {currentUser?.full_name}
                          </p>
                          <p className="text-xs leading-none text-slate-500 dark:text-gray-400">
                            @{currentUser?.username}
                          </p>
                          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                            View profile
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-gray-700" />
                    <div className="p-2 space-y-1">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/profile/${currentUser?.username}`)
                        }
                        className="rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors p-3"
                      >
                        <UserIcon className="mr-3 h-4 w-4 text-teal-600 dark:text-teal-400" />
                        <span className="font-medium">Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/settings")}
                        className="rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors p-3"
                      >
                        <Settings className="mr-3 h-4 w-4 text-slate-600 dark:text-gray-400" />
                        <span className="font-medium">Settings</span>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-gray-700" />
                    <div className="p-2">
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors p-3 text-red-600 dark:text-red-400"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="font-medium">Log out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Enhanced Non-authenticated User Actions
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/auth")}
                    className="hidden sm:flex font-medium text-slate-600 hover:text-slate-800 dark:text-gray-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl px-4 py-2 transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => router.push("/auth")}
                    className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Join Gulf Return
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Enhanced Mobile Menu Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5 text-slate-600 dark:text-gray-400" />
                  ) : (
                    <Menu className="h-5 w-5 text-slate-600 dark:text-gray-400" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-slate-200 dark:border-gray-800 py-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
            >
              {/* Enhanced Mobile Search */}
              <div className="mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search Gulf Return..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-slate-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 rounded-xl transition-all duration-300"
                  />
                </motion.div>
              </div>

              {/* Enhanced Mobile Navigation Links */}
              <div className="space-y-2 mb-6">
                {navLinks.map((link, index) => {
                  // Skip rendering if auth is required but user is not authenticated
                  if (link.requiresAuth && !isAuth) {
                    return null;
                  }

                  const Icon = link.icon;
                  const handleClick = () => {
                    if (link.requiresAuth && !isAuth) {
                      router.push("/auth");
                      setIsMobileMenuOpen(false);
                      return;
                    }
                    router.push(link.href);
                    setIsMobileMenuOpen(false);
                  };

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={handleClick}
                        className="w-full justify-start hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl py-3 px-4 transition-all duration-200 group"
                      >
                        <Icon className="mr-3 h-5 w-5 text-slate-600 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                        <span className="font-medium text-slate-700 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          {link.label}
                        </span>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Enhanced Mobile Auth Actions */}
              {!isAuth && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 border-t border-slate-200 dark:border-gray-800 space-y-3"
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push("/auth");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-xl py-3 border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <span className="font-medium">Sign In</span>
                  </Button>
                  <Button
                    onClick={() => {
                      router.push("/auth");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-xl py-3 shadow-lg transition-all duration-300"
                  >
                    Join Gulf Return
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
