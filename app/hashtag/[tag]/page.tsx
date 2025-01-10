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
export default function HashtagPage({ params }: { params: { tag: string } }) {
  return <HashtagClientPage tag={params.tag} />;
}
