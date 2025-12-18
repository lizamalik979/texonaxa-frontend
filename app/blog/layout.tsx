import { Metadata } from "next";
import React from 'react';

// Blog post type matching your API response
interface BlogPost {
  id: string;
  title: string;
  featuredImage: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
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

// Shared function to fetch blog data for metadata
async function getAllBlogs(): Promise<BlogPost[]> {
  try {
    const apiUrl = process.env.BACKEND_API_URL || "http://localhost:3000";
    
    const response = await fetch(`${apiUrl}/api/post/client/all-blog`, {
      next: { revalidate: 300 }, // 5 minutes ISR
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
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

// Generate metadata in layout
export async function generateMetadata(): Promise<Metadata> {
  const blogs = await getAllBlogs();
  
  return {
    title: "Blog | Your Company Name",
    description: "Read our latest blog posts, insights, and updates",
    keywords: ["blog", "articles", "insights", "updates"],
    openGraph: {
      title: "Blog | Your Company Name",
      description: "Read our latest blog posts, insights, and updates",
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/blog`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog | Your Company Name",
      description: "Read our latest blog posts, insights, and updates",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/blog`,
    },
  };
}

// Generate JSON-LD schema for BlogListingPage
function generateBlogSchema(blogs: BlogPost[]) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog | Your Company Name",
    "description": "Read our latest blog posts, insights, and updates",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/blog`,
    "blogPost": blogs.map((blog) => ({
      "@type": "BlogPosting",
      "headline": blog.title || "",
      "image": blog.featuredImage || "",
      "datePublished": blog.publishedAt || blog.createdAt || "",
      "dateModified": blog.updatedAt || blog.publishedAt || blog.createdAt || "",
      "author": {
        "@type": "Person",
        "name": blog.author?.username || blog.author?.email || "Your Company",
      },
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/blog/${blog.id}`,
    })),
  };

  return schema;
}

const layout = async ({ children }: { children: React.ReactNode }) => {
  const blogs = await getAllBlogs();
  const schema = generateBlogSchema(blogs);

  return (
    <>
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div>{children}</div>
    </>
  );
};

export default layout;