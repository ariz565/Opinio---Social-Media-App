// "use client";

// import { useEffect, useState } from "react";
// import { useInView } from "react-intersection-observer";
// import { Loader2 } from "lucide-react";
// import { PostCard } from "./post-card";
// import { CreatePost } from "./posts/create-post";

// interface Post {
//   id: string;
//   author: {
//     name: string;
//     image: string;
//     username: string;
//   };
//   content: string;
//   image?: string;
//   likes: number;
//   comments: number;
//   timestamp: string;
// }

// const POSTS_PER_PAGE = 5;

// const SAMPLE_IMAGES = [
//   "https://images.unsplash.com/photo-1501504905252-473c47e087f8",
//   "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
//   "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2",
//   "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
//   "https://images.unsplash.com/photo-1520333789090-1afc82db536a",
// ];

// const SAMPLE_AVATARS = [
//   "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
//   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
//   "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
//   "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
//   "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
// ];

// export function InfiniteFeed() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const { ref, inView } = useInView();

//   const fetchPosts = async () => {
//     if (!hasMore || loading) return;

//     setLoading(true);
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     const newPosts: Post[] = Array.from({ length: POSTS_PER_PAGE }, (_, i) => ({
//       id: `${page}-${i}`,
//       author: {
//         name: `User ${posts.length + i + 1}`,
//         image:
//           SAMPLE_AVATARS[Math.floor(Math.random() * SAMPLE_AVATARS.length)],
//         username: `user${posts.length + i + 1}`,
//       },
//       content: `This is post number ${
//         posts.length + i + 1
//       }. Here's some interesting content about technology, innovation, and the future of web development. #tech #innovation #webdev`,
//       image:
//         Math.random() > 0.5
//           ? SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)]
//           : undefined,
//       likes: Math.floor(Math.random() * 100),
//       comments: Math.floor(Math.random() * 20),
//       timestamp: `${Math.floor(Math.random() * 24)}h ago`,
//     }));

//     setPosts((prev) => [...prev, ...newPosts]);
//     setPage((prev) => prev + 1);
//     setLoading(false);

//     // Simulate reaching the end of available posts
//     if (page > 4) {
//       setHasMore(false);
//     }
//   };

//   useEffect(() => {
//     if (inView && hasMore) {
//       fetchPosts();
//     }
//   }, [inView]);

//   return (
//     <div className="space-y-0">
//       <CreatePost />
//       {posts.map((post) => (
//         <PostCard key={post.id} {...post} />
//       ))}
//       {hasMore && (
//         <div ref={ref} className="flex justify-center p-4">
//           {loading && <Loader2 className="h-6 w-6 animate-spin" />}
//         </div>
//       )}
//       {!hasMore && posts.length > 0 && (
//         <div className="text-center p-4 text-muted-foreground">
//           No more posts to load
//         </div>
//       )}
//     </div>
//   );
// }
