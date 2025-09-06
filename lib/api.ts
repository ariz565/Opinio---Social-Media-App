import axios, { AxiosInstance, AxiosResponse } from "axios";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          console.log("🔄 Token expired, attempting refresh...");

          const refreshResponse = await axios.post(
            `${API_BASE_URL}/api/v1/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token, refresh_token: newRefreshToken } =
            refreshResponse.data;

          // Update tokens
          localStorage.setItem("access_token", access_token);
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }

          // Update the authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          console.log("✅ Token refreshed successfully, retrying request...");

          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
      }

      // If refresh fails or no refresh token, redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);

// Types
export interface User {
  _id: string;
  id: string;
  email: string;
  username: string;
  full_name: string;
  name: string;
  avatar_url?: string;
  avatar?: string;
  bio?: string;
  is_verified: boolean;
  is_private: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  post_type: "text" | "image" | "video" | "gif" | "poll";
  media?: Array<{
    url: string;
    type: "image" | "video" | "gif";
    thumbnail?: string;
    width?: number;
    height?: number;
  }>;
  poll?: {
    question: string;
    options: Array<{
      id: string;
      text: string;
      votes: number;
    }>;
    multiple_choice: boolean;
    expires_at?: string;
  };
  hashtags: string[];
  mentions: string[];
  location?: {
    name: string;
    coordinates?: [number, number];
  };
  mood_activity?: string;
  visibility: "public" | "followers" | "close_friends" | "private";
  allow_comments: boolean;
  allow_shares: boolean;
  is_pinned: boolean;

  // Author information
  author: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    email: string;
  };

  // Engagement stats
  like_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;

  // User interaction states
  is_liked: boolean;
  is_bookmarked: boolean;
  is_shared: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
  scheduled_for?: string;
  pinned_at?: string;
  archived_at?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  depth: number;
  path: string;
  parent_comment_id?: string;
  created_at: string;
  updated_at: string;
  reactions: {
    total: number;
    like: number;
    love: number;
    laugh: number;
    wow: number;
    sad: number;
    angry: number;
    care: number;
  };
  reply_count: number;
  user?: User;
  replies?: Comment[];
}

export interface LoginRequest {
  email: string;
  password: string;
  otp_code?: string; // For first-time login verification
}

export interface RegisterRequest {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

export interface EmailVerificationRequest {
  email: string;
  otp_code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp_code: string;
  new_password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items?: T[]; // Some endpoints use 'items'
  posts?: T[]; // Feed endpoints use 'posts'
  total: number;
  page: number;
  limit?: number;
  per_page?: number;
  has_next: boolean;
  has_prev: boolean;
}

// Utility function for quick logout from anywhere in the app
export const quickLogout = () => {
  // Clear all storage
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem("refresh_token");
  sessionStorage.clear();

  // Trigger auth state change event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("authStateChanged"));
    window.location.href = "/auth";
  }
};

// Auth API object
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/api/v1/auth/login",
      {
        email: data.email,
        password: data.password,
        ...(data.otp_code && { otp_code: data.otp_code }),
      }
    );

    // Store token and user in localStorage
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // Trigger auth state change event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("authStateChanged"));
    }

    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/api/v1/auth/register",
      data
    );

    // Store token and user in localStorage
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // Trigger auth state change event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("authStateChanged"));
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      // Try to call backend logout endpoint
      await api.post("/api/v1/auth/logout");
    } catch (error) {
      // Continue with logout even if API call fails (e.g., 404, network error)
      console.warn(
        "Backend logout failed, continuing with client-side logout:",
        error
      );
    }

    // Always perform client-side cleanup
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");

    // Clear any other auth-related storage
    sessionStorage.clear();

    // Trigger auth state change event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("authStateChanged"));

      // Redirect to auth page after logout
      window.location.href = "/auth";
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get("/api/v1/auth/me");
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/api/v1/auth/refresh"
    );
    localStorage.setItem("access_token", response.data.access_token);
    return response.data;
  },

  verifyEmail: async (
    data: EmailVerificationRequest
  ): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.post(
      "/api/v1/auth/verify-email",
      data
    );
    return response.data;
  },

  resendVerification: async (
    data: ResendVerificationRequest
  ): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.post(
      "/api/v1/auth/resend-verification",
      data
    );
    return response.data;
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.post(
      "/api/v1/auth/forgot-password",
      data
    );
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.post(
      "/api/v1/auth/reset-password",
      data
    );
    return response.data;
  },
};

// Helper function to transform raw post data from backend to frontend Post interface
const transformPostData = (rawPost: any): Post => {
  return {
    id: rawPost.id || rawPost._id,
    user_id: rawPost.user_id,
    content: rawPost.content,
    post_type: rawPost.post_type || "text",
    media: rawPost.media || [],
    poll: rawPost.poll || null,
    hashtags: rawPost.hashtags || [],
    mentions: rawPost.mentions || [],
    location: rawPost.location || null,
    mood_activity: rawPost.mood_activity || null,
    visibility: rawPost.visibility || "public",
    allow_comments: rawPost.allow_comments !== false,
    allow_shares: rawPost.allow_shares !== false,
    is_pinned: rawPost.is_pinned || false,

    // Transform author data (might be missing for some posts)
    author: rawPost.author || {
      id: rawPost.user_id,
      username: "unknown",
      full_name: "Unknown User",
      avatar_url: null,
      email: "",
    },

    // Transform engagement stats
    like_count:
      rawPost.like_count || rawPost.engagement_stats?.likes_count || 0,
    comment_count:
      rawPost.comment_count || rawPost.engagement_stats?.comments_count || 0,
    share_count:
      rawPost.share_count || rawPost.engagement_stats?.shares_count || 0,
    view_count:
      rawPost.view_count || rawPost.engagement_stats?.views_count || 0,

    // User interaction states
    is_liked: rawPost.is_liked || false,
    is_bookmarked: rawPost.is_bookmarked || false,
    is_shared: rawPost.is_shared || false,

    // Timestamps
    created_at: rawPost.created_at,
    updated_at: rawPost.updated_at,
    published_at: rawPost.published_at || null,
    scheduled_for: rawPost.scheduled_for || null,
    pinned_at: rawPost.pinned_at || null,
    archived_at: rawPost.archived_at || null,
  };
};

// Posts API
export const postsAPI = {
  getFeed: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Post>> => {
    const response: AxiosResponse<PaginatedResponse<Post>> = await api.get(
      "/api/v1/posts/feed",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  getTrendingPosts: async (
    page: number = 1,
    limit: number = 20,
    hours: number = 24
  ): Promise<PaginatedResponse<Post>> => {
    const response: AxiosResponse<any> = await api.get(
      "/api/v1/posts/trending",
      {
        params: { page, limit, hours },
      }
    );

    // Transform raw backend data to frontend Post interface
    const transformedPosts = response.data.posts.map(transformPostData);

    return {
      items: transformedPosts,
      total: response.data.total,
      page: response.data.page,
      limit: response.data.per_page,
      has_next: response.data.has_next,
      has_prev: response.data.has_prev,
    };
  },

  // Removed getAllPublicPosts - using trending posts with pagination instead

  getExplorePosts: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Post>> => {
    try {
      // Use trending posts for explore section
      return await postsAPI.getTrendingPosts(page, limit, 168); // 1 week
    } catch (error: any) {
      console.error("Error fetching explore posts:", error);

      // If it's a 404 or similar, return empty result instead of throwing
      if (error.response?.status === 404) {
        console.log("No posts found, returning empty result");
        return {
          items: [],
          total: 0,
          page,
          limit,
          has_next: false,
          has_prev: false,
        };
      }

      // Re-throw other errors
      throw error;
    }
  },

  getPost: async (postId: string): Promise<Post> => {
    const response: AxiosResponse<Post> = await api.get(
      `/api/v1/posts/${postId}`
    );
    return response.data;
  },

  createPost: async (data: {
    content: string;
    post_type?: "text" | "image" | "video" | "gif" | "poll";
    media?: Array<{
      url: string;
      type: "image" | "video" | "gif";
      thumbnail?: string;
    }>;
    poll?: {
      question: string;
      options: Array<{
        text: string;
      }>;
      multiple_choice?: boolean;
      expires_at?: string;
    };
    hashtags?: string[];
    mentions?: string[];
    location?: {
      name: string;
      coordinates?: [number, number];
    };
    mood_activity?: string;
    visibility?: "public" | "followers" | "close_friends" | "private";
    allow_comments?: boolean;
    allow_shares?: boolean;
  }): Promise<Post> => {
    const postData = {
      content: data.content,
      post_type: data.post_type || "text",
      media: data.media || [],
      poll: data.poll || null,
      hashtags: data.hashtags || [],
      mentions: data.mentions || [],
      location: data.location || null,
      mood_activity: data.mood_activity || null,
      visibility: data.visibility || "public",
      allow_comments: data.allow_comments !== false,
      allow_shares: data.allow_shares !== false,
    };

    const response: AxiosResponse<any> = await api.post(
      "/api/v1/posts",
      postData
    );
    return transformPostData(response.data);
  },

  updatePost: async (
    postId: string,
    data: { content: string; visibility?: string }
  ): Promise<Post> => {
    const response: AxiosResponse<Post> = await api.put(
      `/api/v1/posts/${postId}`,
      data
    );
    return response.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/api/v1/posts/${postId}`);
  },

  getUserPosts: async (
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Post>> => {
    const response: AxiosResponse<PaginatedResponse<Post>> = await api.get(
      `/api/v1/posts/user/${userId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Like/Unlike Post
  likePost: async (
    postId: string
  ): Promise<{ message: string; is_liked: boolean; like_count: number }> => {
    const response: AxiosResponse<{
      message: string;
      is_liked: boolean;
      like_count: number;
    }> = await api.post(`/api/v1/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (
    postId: string
  ): Promise<{ message: string; is_liked: boolean; like_count: number }> => {
    const response: AxiosResponse<{
      message: string;
      is_liked: boolean;
      like_count: number;
    }> = await api.delete(`/api/v1/posts/${postId}/like`);
    return response.data;
  },

  // Get Like Status
  getLikeStatus: async (
    postId: string
  ): Promise<{
    is_liked: boolean;
    like_count: number;
    total_reactions: number;
  }> => {
    const response: AxiosResponse<{
      is_liked: boolean;
      like_count: number;
      total_reactions: number;
    }> = await api.get(`/api/v1/posts/${postId}/like-status`);
    return response.data;
  },

  // Add Comment
  addComment: async (postId: string, content: string): Promise<Comment> => {
    const response: AxiosResponse<Comment> = await api.post(
      `/api/v1/posts/${postId}/comments`,
      { content }
    );
    return response.data;
  },

  // Get Comments
  getComments: async (
    postId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Comment>> => {
    const response: AxiosResponse<PaginatedResponse<Comment>> = await api.get(
      `/api/v1/posts/${postId}/comments`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Bookmark Post
  bookmarkPost: async (
    postId: string
  ): Promise<{ message: string; is_bookmarked: boolean }> => {
    const response: AxiosResponse<{ message: string; is_bookmarked: boolean }> =
      await api.post(`/api/v1/posts/${postId}/bookmark`);
    return response.data;
  },

  // Share Post
  sharePost: async (
    postId: string,
    content?: string
  ): Promise<{ message: string; share_count: number }> => {
    const response: AxiosResponse<{ message: string; share_count: number }> =
      await api.post(`/api/v1/posts/${postId}/share`, { content });
    return response.data;
  },

  // Upload Media
  uploadMedia: async (
    files: File[]
  ): Promise<
    Array<{
      url: string;
      type: "image" | "video" | "gif";
      thumbnail?: string;
    }>
  > => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    const response = await api.post("/api/v1/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Create Post with Media (alternative approach)
  createPostWithMedia: async (
    files: File[],
    data: {
      content: string;
      post_type?: "text" | "image" | "video" | "gif" | "poll";
      hashtags?: string[];
      mentions?: string[];
      location?: {
        name: string;
        coordinates?: [number, number];
      };
      mood_activity?: string;
      visibility?: "public" | "followers" | "close_friends" | "private";
      allow_comments?: boolean;
      allow_shares?: boolean;
    }
  ): Promise<Post> => {
    const formData = new FormData();

    // Add files with the correct parameter name 'files'
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Add post data
    formData.append("content", data.content);
    formData.append("post_type", data.post_type || "text");
    formData.append("visibility", data.visibility || "public");
    formData.append("allow_comments", String(data.allow_comments !== false));
    formData.append("allow_shares", String(data.allow_shares !== false));

    if (data.hashtags && data.hashtags.length > 0) {
      formData.append("hashtags", JSON.stringify(data.hashtags));
    }
    if (data.mentions && data.mentions.length > 0) {
      formData.append("mentions", JSON.stringify(data.mentions));
    }
    if (data.location) {
      formData.append("location", JSON.stringify(data.location));
    }
    if (data.mood_activity) {
      formData.append("mood_activity", data.mood_activity);
    }

    const response: AxiosResponse<any> = await api.post(
      "/api/v1/posts/with-media",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return transformPostData(response.data);
  },
};

// Reactions API
export const reactionsAPI = {
  addReaction: async (
    targetType: "posts" | "comments",
    targetId: string,
    reactionType: string
  ): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.post(
      `/api/v1/reactions/${targetType}/${targetId}/${reactionType}`
    );
    return response.data;
  },

  removeReaction: async (
    targetType: "posts" | "comments",
    targetId: string,
    reactionType: string
  ): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.delete(
      `/api/v1/reactions/${targetType}/${targetId}/${reactionType}`
    );
    return response.data;
  },

  getReactions: async (
    targetType: "posts" | "comments",
    targetId: string
  ): Promise<any> => {
    const response: AxiosResponse<any> = await api.get(
      `/api/v1/reactions/${targetType}/${targetId}`
    );
    return response.data;
  },
};

// Comments API
export const commentsAPI = {
  getPostComments: async (
    postId: string,
    page: number = 1,
    limit: number = 20,
    sort_by: string = "newest"
  ): Promise<PaginatedResponse<Comment>> => {
    const response: AxiosResponse<PaginatedResponse<Comment>> = await api.get(
      `/api/v1/comments/posts/${postId}`,
      {
        params: { page, limit, sort_by },
      }
    );
    return response.data;
  },

  createComment: async (
    postId: string,
    data: { content: string; mentions?: string[] }
  ): Promise<Comment> => {
    const response: AxiosResponse<Comment> = await api.post(
      `/api/v1/comments/posts/${postId}`,
      data
    );
    return response.data;
  },

  replyToComment: async (
    commentId: string,
    data: { content: string; mentions?: string[] }
  ): Promise<Comment> => {
    const response: AxiosResponse<Comment> = await api.post(
      `/api/v1/comments/${commentId}/reply`,
      data
    );
    return response.data;
  },

  updateComment: async (
    commentId: string,
    data: { content: string }
  ): Promise<Comment> => {
    const response: AxiosResponse<Comment> = await api.put(
      `/api/v1/comments/${commentId}`,
      data
    );
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/api/v1/comments/${commentId}`);
  },

  likeComment: async (
    commentId: string
  ): Promise<{ message: string; likes: string[] }> => {
    const response: AxiosResponse<{ message: string; likes: string[] }> =
      await api.post(`/api/v1/comments/${commentId}/like`);
    return response.data;
  },

  unlikeComment: async (
    commentId: string
  ): Promise<{ message: string; likes: string[] }> => {
    const response: AxiosResponse<{ message: string; likes: string[] }> =
      await api.delete(`/api/v1/comments/${commentId}/like`);
    return response.data;
  },

  getCommentReplies: async (
    commentId: string,
    page: number = 1,
    limit: number = 5
  ): Promise<PaginatedResponse<Comment>> => {
    const response: AxiosResponse<PaginatedResponse<Comment>> = await api.get(
      `/api/v1/comments/${commentId}/replies`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};

// Bookmarks API
export const bookmarksAPI = {
  getUserBookmarks: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<any>> => {
    const response: AxiosResponse<PaginatedResponse<any>> = await api.get(
      "/api/v1/bookmarks",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  bookmarkPost: async (
    postId: string,
    collectionId?: string,
    notes?: string
  ): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.post(
      `/api/v1/bookmarks/posts/${postId}`,
      {
        collection_id: collectionId,
        notes,
      }
    );
    return response.data;
  },

  removeBookmark: async (postId: string): Promise<void> => {
    await api.delete(`/api/v1/bookmarks/posts/${postId}`);
  },
};

// Follows API
export const followsAPI = {
  followUser: async (userId: string): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.post(
      `/api/v1/follows/users/${userId}/follow`
    );
    return response.data;
  },

  unfollowUser: async (userId: string): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.delete(
      `/api/v1/follows/users/${userId}/unfollow`
    );
    return response.data;
  },

  getFollowers: async (
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> => {
    const response: AxiosResponse<PaginatedResponse<User>> = await api.get(
      `/api/v1/follows/users/${userId}/followers`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  getFollowing: async (
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> => {
    const response: AxiosResponse<PaginatedResponse<User>> = await api.get(
      `/api/v1/follows/users/${userId}/following`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getUser: async (username: string): Promise<User> => {
    const response: AxiosResponse<User> = await api.get(
      `/api/v1/users/${username}`
    );
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response: AxiosResponse<User> = await api.put(
      "/api/v1/users/me",
      data
    );
    return response.data;
  },

  searchUsers: async (
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> => {
    const response: AxiosResponse<PaginatedResponse<User>> = await api.get(
      "/api/v1/users/search",
      {
        params: { q: query, page, limit },
      }
    );
    return response.data;
  },

  // Get friend suggestions (can be used as a user list)
  getFriendSuggestions: async (limit: number = 20): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await api.get(
      "/api/v1/suggestions/friends",
      {
        params: { limit },
      }
    );
    return response.data;
  },

  // Get connection suggestions - alternative source for user lists
  getConnectionSuggestions: async (limit: number = 10): Promise<User[]> => {
    const response: AxiosResponse<{ suggestions: User[]; total: number }> =
      await api.get("/api/v1/connections/suggestions", {
        params: { limit },
      });
    return response.data.suggestions || [];
  },

  // Get trending users by getting followers from trending posts
  getTrendingUsers: async (limit: number = 20): Promise<User[]> => {
    try {
      // Get trending posts first
      const trendingPosts = await postsAPI.getTrendingPosts(1, limit);

      // Extract unique users from trending posts
      const userMap = new Map<string, User>();

      if (trendingPosts.posts) {
        trendingPosts.posts.forEach((post) => {
          if (post.author && post.author.id) {
            userMap.set(post.author.id, {
              _id: post.author.id,
              id: post.author.id,
              email: post.author.email || "",
              username: post.author.username,
              full_name: post.author.full_name,
              name: post.author.full_name,
              avatar_url: post.author.avatar_url,
              bio: "",
              is_verified: false,
              is_private: false,
              followers_count: 0,
              following_count: 0,
              posts_count: 0,
            });
          }
        });
      }

      return Array.from(userMap.values()).slice(0, limit);
    } catch (error) {
      console.error("Error getting trending users:", error);
      return [];
    }
  },

  // Get current user's followers as a user source
  getMyFollowers: async (limit: number = 20): Promise<User[]> => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!currentUser.id) return [];

      const response = await followsAPI.getFollowers(currentUser.id, 1, limit);
      return response.items || [];
    } catch (error) {
      console.error("Error getting my followers:", error);
      return [];
    }
  },
};

// Utility functions
export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Profile API endpoints
export const profileAPI = {
  // Get user profile
  getProfile: async (username: string): Promise<any> => {
    const response = await api.get(`/api/v1/profile/${username}`);
    return response.data;
  },

  // Update basic info
  updateBasicInfo: async (data: {
    full_name?: string;
    bio?: string;
    location?: string;
    website?: string;
    phone?: string;
  }): Promise<any> => {
    const response = await api.put("/api/v1/profile/basic-info", data);
    return response.data;
  },

  // Experience endpoints
  updateExperience: async (experience: any[]): Promise<any> => {
    const response = await api.put("/api/v1/profile/experience", {
      experience,
    });
    return response.data;
  },

  addExperience: async (experience: any): Promise<any> => {
    const response = await api.post("/api/v1/profile/experience", experience);
    return response.data;
  },

  deleteExperience: async (itemId: string): Promise<any> => {
    const response = await api.delete(`/api/v1/profile/experience/${itemId}`);
    return response.data;
  },

  // Education endpoints
  updateEducation: async (education: any[]): Promise<any> => {
    const response = await api.put("/api/v1/profile/education", { education });
    return response.data;
  },

  addEducation: async (education: any): Promise<any> => {
    const response = await api.post("/api/v1/profile/education", education);
    return response.data;
  },

  deleteEducation: async (itemId: string): Promise<any> => {
    const response = await api.delete(`/api/v1/profile/education/${itemId}`);
    return response.data;
  },

  // Skills endpoints
  updateSkills: async (skills: any[]): Promise<any> => {
    const response = await api.put("/api/v1/profile/skills", { skills });
    return response.data;
  },

  // Languages endpoints
  updateLanguages: async (languages: any[]): Promise<any> => {
    const response = await api.put("/api/v1/profile/languages", { languages });
    return response.data;
  },

  // Certifications endpoints
  updateCertifications: async (certifications: any[]): Promise<any> => {
    const response = await api.put("/api/v1/profile/certifications", {
      certifications,
    });
    return response.data;
  },

  addCertification: async (certification: any): Promise<any> => {
    const response = await api.post(
      "/api/v1/profile/certifications",
      certification
    );
    return response.data;
  },

  deleteCertification: async (itemId: string): Promise<any> => {
    const response = await api.delete(
      `/api/v1/profile/certifications/${itemId}`
    );
    return response.data;
  },

  // Interests endpoints
  updateInterests: async (interests: string[]): Promise<any> => {
    const response = await api.put("/api/v1/profile/interests", { interests });
    return response.data;
  },

  // Social links endpoints
  updateSocialLinks: async (social_links: any): Promise<any> => {
    const response = await api.put("/api/v1/profile/social-links", {
      social_links,
    });
    return response.data;
  },

  // Photo upload endpoints
  uploadProfilePhoto: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      "/api/v1/profile/upload/profile-photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  uploadCoverPhoto: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      "/api/v1/profile/upload/cover-photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export default api;
