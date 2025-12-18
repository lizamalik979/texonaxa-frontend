import BlogListing from "@/app/components/blog/BlogListing";
import SearchBar from "@/app/components/blog/SearchBar";
// Define the blog post type based on your actual API response
interface BlogPost {
  id: string;
  title: string;
  featuredImage: string | null;
  publishedAt: string;
  createdAt: string;
  excerpt: string;
  updatedAt: string;
  slug: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
}

interface BlogApiResponse {
  success: boolean;
  posts: BlogPost[];
  count: number;
}

// Fetch function with ISR - 5 minute revalidation
async function getAllBlogs(): Promise<BlogPost[]> {
  try {
    const apiUrl = process.env.BACKEND_API_URL || "http://localhost:3000";

    // ISR: next.revalidate = 300 seconds (5 minutes)
    const response = await fetch(`${apiUrl}/api/post/client/all-blog`, {
      next: { revalidate: 300 }, // 5 minutes ISR
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch blog data:", response.status, response.statusText);
      return [];
    }

    const jsonData: BlogApiResponse = await response.json();

    // API returns { success: true, posts: [...], count: number }
    if (jsonData && jsonData.success && Array.isArray(jsonData.posts)) {
      return jsonData.posts;
    }

    return [];
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return [];
  }
}

// Server Component - Rendered at build time and regenerated every 5 minutes
export default async function BlogPage() {
  const blogs = await getAllBlogs();

  return (
    <main className="min-h-screen max-w-[1280px] mx-auto mt-20">
      <SearchBar />
      <BlogListing posts={blogs} />
    </main>
  );
}