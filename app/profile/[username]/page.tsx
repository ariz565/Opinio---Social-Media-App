import { ProfilePage } from "./profile-page";

// Dynamic route - no static generation
export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;

  // Fetch user data dynamically instead of using static data
  const userData = await getUserData(params.username);

  return <ProfilePage username={params.username} initialData={userData} />;
}

async function getUserData(username: string) {
  // Default user data structure
  return {
    name: formatDisplayName(username),
    username,
    bio: "Welcome to my profile! Connect with me to see more.",
    avatar: "https://github.com/shadcn.png",
    banner: "https://images.unsplash.com/photo-1506102383123-c8ef1e872756",
    followers: 0,
    following: 0,
    details: {
      location: "Unknown",
      website: "",
      joinDate: "Recently",
      work: [],
      education: [],
    },
    stats: {
      posts: 0,
      followers: 0,
      following: 0,
      likes: 0,
    },
  };
}

function formatDisplayName(username: string): string {
  // Convert username like 'testuser10' to 'Test User 10'
  return username
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Split camelCase
    .replace(/(\d+)/g, " $1") // Add space before numbers
    .split(/[\s_-]+/) // Split on spaces, underscores, dashes
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}
