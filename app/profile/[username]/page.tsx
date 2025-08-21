import EnhancedProfilePage from "./enhanced-profile";

// Dynamic route - no static generation
export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;

  return <EnhancedProfilePage username={params.username} />;
}
