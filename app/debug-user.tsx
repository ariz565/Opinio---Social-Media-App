"use client";

import { getCurrentUser, isAuthenticated } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DebugUser() {
  const router = useRouter();
  
  if (!isAuthenticated()) {
    return <div>Not logged in</div>;
  }
  
  const user = getCurrentUser();
  
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Current User Debug</h2>
      <div className="space-y-2">
        <p><strong>Username:</strong> {user?.username || "No username set"}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Full Name:</strong> {user?.full_name}</p>
        <p><strong>User ID:</strong> {user?.id}</p>
      </div>
      
      {user?.username && (
        <div className="mt-4">
          <Button 
            onClick={() => router.push(`/profile/${user.username}`)}
            className="w-full"
          >
            Visit My Profile
          </Button>
        </div>
      )}
      
      <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
