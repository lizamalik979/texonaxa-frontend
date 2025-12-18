import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Poppins } from "next/font/google";
import "../../components/css/blog-content.css";
import Link from "next/link";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
});

// Blog Post Detail Types
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  username: string;
  email: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogPostDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  category: Category[];
  faq_items: FAQItem[];
  additionalFields?: Record<string, any>;
  schema?: any[];
}

interface BlogDetailApiResponse {
  success: boolean;
  post: BlogPostDetail;
}

// Fetch blog post by slug with ISR
async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    const apiUrl = process.env.BACKEND_API_URL || "http://localhost:3000";

    // ISR: next.revalidate = 300 seconds (5 minutes)
    const response = await fetch(
      `${apiUrl}/api/post/client/detail-blog?slug=${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 300 }, // 5 minutes ISR
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error("Failed to fetch blog post:", response.status, response.statusText);
      return null;
    }

    const jsonData: BlogDetailApiResponse = await response.json();

    if (jsonData && jsonData.success && jsonData.post) {
      return jsonData.post;
    }

    return null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.featuredImage || `${siteUrl}/images/default-blog.jpg`;

  return {
    title: post.title,
    description: post.excerpt || post.title,
    keywords: post.category.map(cat => cat.name).join(', '),
    authors: [{ name: post.author.username }],
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: postUrl,
      siteName: "Your Site Name",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.username],
      tags: post.category.map(cat => cat.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

// Main Blog Post Page Component
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="relative">
      <article className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <header className="mb-8">
          {/* Categories */}
          {post.category && post.category.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.category.map((cat) => (
                <span
                  key={cat.id}
                  className={`px-3 py-1 rounded-full bg-[#FEE39A]/20 text-[#FEE39A] text-sm ${poppins.className}`}
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 ${poppins.className}`}>
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
            {post.author && (
              <div className="flex items-center gap-2">
                <span className={`text-sm ${poppins.className}`}>
                  By {post.author.username}
                </span>
              </div>
            )}
            {post.publishedAt && (
              <span className={`text-sm ${poppins.className}`}>
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Table of Contents - Below Image
          <TableOfContents content={post.content} /> */}
        </header>

        {/* Content Section */}
        <div className="blog-content-wrapper">
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Additional Fields */}
        {post.additionalFields && Object.keys(post.additionalFields).length > 0 && (
          <div className="mt-12 space-y-8">
            {Object.entries(post.additionalFields).map(([key, field]) => (
              <div key={key} className="border-t border-white/10 pt-8">
                {field.label && (
                  <h2 className={`text-2xl font-bold text-white mb-4 ${poppins.className}`}>
                    {field.label}
                  </h2>
                )}
                {field.value && (
                  <div className="blog-content-wrapper">
                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: field.value }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FAQ Section - Enhanced with better checking */}
        {post.faq_items && Array.isArray(post.faq_items) && post.faq_items.length > 0 ? (
          <div className="mt-12 border-t border-white/10 pt-8">
            <h2 className={`text-3xl font-bold text-white mb-6 ${poppins.className}`}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {post.faq_items.map((faq, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-6">
                  {faq.question && (
                    <h3 className={`text-xl font-semibold text-white mb-3 ${poppins.className}`}>
                      {faq.question}
                    </h3>
                  )}
                  {faq.answer && (
                    <div className={`text-gray-300 leading-relaxed whitespace-pre-line ${poppins.className}`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </div>
  );
}