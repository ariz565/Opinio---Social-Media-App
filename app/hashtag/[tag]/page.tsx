// Server Component
export async function generateStaticParams() {
  const tags = [
    "WebDevelopment",
    "ArtificialIntelligence",
    "Innovation",
    "Technology",
    "Programming",
  ];

  return tags.map((tag) => ({ tag }));
}

import { HashtagClientPage } from "./topic-page";

// Main server component
export default async function HashtagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params;
  return <HashtagClientPage tag={params.tag} />;
}
