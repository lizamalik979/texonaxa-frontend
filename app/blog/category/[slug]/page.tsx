import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Poppins } from "next/font/google";
import BlogListing from "@/app/components/blog/BlogListing";
import Pagination from "@/app/components/blog/Pagination";
import Link from "next/link";
import SearchBar from "@/app/components/blog/SearchBar";

// Force dynamic rendering for SSR (data visible in View Source)
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching for true SSR

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
});

// Blog Post Type
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string | null;
  publishedAt: string;
  createdAt: string;
  excerpt: string;
  updatedAt: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
}

interface CategoryFilterApiResponse {
  success: boolean;
  posts: BlogPost[];
  count: number;
  totalPages?: number;
  currentPage?: number;
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Fetch posts by category with pagination (10 posts per page) - SSR
async function getCategoryPosts(
  category: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  posts: BlogPost[];
  count: number;
  totalPages: number;
  currentPage: number;
} | null> {
  try {
    const apiUrl = process.env.BACKEND_API_URL || "http://localhost:3000";

    // SSR: cache: 'no-store' ensures fresh data on every request
    const response = await fetch(
      `${apiUrl}/api/post/client/filter?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`,
      {
        cache: 'no-store', // Force SSR - no caching
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error("Failed to fetch category posts:", response.status, response.statusText);
      return null;
    }

    const jsonData: CategoryFilterApiResponse = await response.json();

    if (jsonData && jsonData.success && Array.isArray(jsonData.posts)) {
      // Calculate total pages if not provided by API
      const totalPages = jsonData.totalPages || Math.ceil(jsonData.count / limit);
      const currentPage = jsonData.currentPage || page;

      return {
        posts: jsonData.posts,
        count: jsonData.count,
        totalPages,
        currentPage,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return {
    title: `${categoryName} | Blog`,
    description: `Browse all blog posts in the ${categoryName} category`,
    keywords: [categoryName, "blog", "articles"],
    openGraph: {
      title: `${categoryName} | Blog`,
      description: `Browse all blog posts in the ${categoryName} category`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/blog/category/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} | Blog`,
      description: `Browse all blog posts in the ${categoryName} category`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/blog/category/${slug}`,
    },
  };
}

// Main Category Page Component - Server Component with SSR
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  // Fetch posts for this category (10 posts per page) - Server-side rendered
  const data = await getCategoryPosts(slug, currentPage, 10);

  if (!data || data.posts.length === 0) {
    notFound();
  }

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return (
    <main className="min-h-screen max-w-[1280px] mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        <SearchBar/>
      {/* Category Title */}
      <div className="mb-8">
        <h1 className={`text-4xl font-bold text-white ${poppins.className}`}>
          {categoryName.split(" ").map((word)=> word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
        </h1>
      </div>

      {/* Blog Listing - 3 Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.posts.map((post) => {
          // Format date helper
          const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          };

          return (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="group relative h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[rgba(19,19,19,0.9)] to-[rgba(19,18,18,0.45)] hover:opacity-90 transition-all duration-300 cursor-pointer flex flex-col">
                {/* Featured Image */}
                {post.featuredImage ? (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay with hexagonal pattern effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      {/* Hexagonal overlay pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 right-4 w-12 h-12 border-2 border-white/30 rotate-45"></div>
                        <div className="absolute top-8 right-8 w-8 h-8 border-2 border-white/20 rotate-45"></div>
                        <div className="absolute bottom-4 left-4 w-10 h-10 border-2 border-white/25 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>
                )}

                {/* Content */}
                <div className="px-4 py-6 flex flex-col flex-1 space-y-3">
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-3">
                    {post.publishedAt && (
                      <p className={`text-xs text-gray-400 ${poppins.className}`}>
                        {formatDate(post.publishedAt)}
                      </p>
                    )}
                    {post.author && (
                      <p className={`text-xs text-gray-400 ${poppins.className}`}>
                        {post.author.username}
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold text-white line-clamp-2 group-hover:text-[#FEE39A] transition-colors ${poppins.className}`}>
                    {post.title}
                  </h3>

                  {/* Excerpt/Description */}
                  {post.excerpt && (
                    <p className={`text-sm text-white/80 line-clamp-3 flex-1 ${poppins.className}`}>
                      {post.excerpt}
                    </p>
                  )}

                  {/* Read More Link */}
                  <div className="pt-2">
                    <span className={`text-sm text-[#FEE39A] font-medium group-hover:underline transition-colors ${poppins.className}`}>
                      Read More →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          baseUrl={`/blog/category/${slug}`}
        />
      )}
    </main>
  );
}