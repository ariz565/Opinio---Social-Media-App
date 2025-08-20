"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, LogIn, ArrowRight, Users, TrendingUp, MapPin } from 'lucide-react';

export const LoggedOutSidebar = () => {
  const router = useRouter();

  return (
    <div className="sticky top-24 space-y-6">
      {/* Main CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader className="pb-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 relative mx-auto">
                <Image
                  src="/assets/images/gulf-return-logo.jpg"
                  alt="Gulf Return"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Join Gulf Return
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Connect with thousands of Gulf professionals and unlock new opportunities
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/auth')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                size="lg"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
              
              <Button
                onClick={() => router.push('/auth')}
                variant="outline"
                className="w-full border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                size="lg"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <Users className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                  <span>10K+ Users</span>
                </div>
                <div>
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-500" />
                  <span>Growing Fast</span>
                </div>
                <div>
                  <MapPin className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                  <span>Gulf Region</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Benefits Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Why professionals choose us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Professional Networking
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Connect with industry leaders and peers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Career Opportunities
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Discover jobs and collaborations
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Knowledge Sharing
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Learn from experienced professionals
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Regional Focus
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Gulf-specific content and connections
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => router.push('/auth')}
                variant="ghost"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                size="sm"
              >
                Get started today
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Join the community
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">10K+</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Active Users</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">500+</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Companies</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">50+</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Cities</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">24/7</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
              </div>
            </div>
            
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Join thousands of professionals already growing their careers
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
