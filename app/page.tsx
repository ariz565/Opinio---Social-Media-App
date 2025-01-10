// import { InfiniteFeed } from "@/components/feed/infinite-feed";
import { PagesSection } from "@/components/pages-section";
import { ProfileCard } from "@/components/profile-card";
import { TrendingCard } from "@/components/trending-card";
import { PeopleYouMayKnow } from "@/components/people-you-may-know";
import { ChatSystem } from "@/components/chat/chat-system";
import { FeedTabs } from "@/components/feed/feed-tabs";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="top-20 space-y-6">
              <ProfileCard />
              <PagesSection />
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {/* <InfiniteFeed /> */}
            <FeedTabs />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:col-span-1 lg:block">
            <div className="top-20 space-y-6">
              <TrendingCard />
              <PeopleYouMayKnow />
              <ChatSystem />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
