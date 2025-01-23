import { ProfilePage } from "./profile-page";

// Server Component
const STATIC_USERS = [
  {
    username: "johndoe",
    name: "John Doe",
    avatar: "https://github.com/shadcn.png",
  },
  {
    username: "demotest",
    name: "Demo Test",
    avatar: "https://github.com/shadcn.png",
  },

  {
    username: "sarahwilson",
    name: "Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
] as const;

export function generateStaticParams() {
  return STATIC_USERS.map((user) => ({
    username: user.username,
  }));
}

export default async function Page(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const userData = getUserData(params.username);
  return <ProfilePage username={params.username} initialData={userData} />;
}

function getUserData(username: string) {
  const user = STATIC_USERS.find((u) => u.username === username);

  return {
    name: user?.name ?? "Unknown User",
    username,
    bio: "Full-stack developer passionate about creating beautiful and functional web applications.",
    avatar: user?.avatar ?? "https://github.com/shadcn.png",
    banner: "https://images.unsplash.com/photo-1506102383123-c8ef1e872756",
    followers: 1234,
    following: 567,
    details: {
      location: "San Francisco, CA",
      website: "https://johndoe.dev",
      joinDate: "January 2024",
      work: [
        {
          position: "Senior Software Engineer",
          company: "Tech Corp",
          current: true,
        },
      ],
      education: [
        {
          school: "University of Technology",
          degree: "BS Computer Science",
          graduationYear: "2020",
        },
      ],
    },
  };
}
