import { Metadata } from "next";
import React from 'react';

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

// Fetch blog post for schema
async function getBlogPostForSchema(slug: string): Promise<BlogPostDetail | null> {
  try {
    const apiUrl = process.env.BACKEND_API_URL || "http://localhost:3000";
    
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
      return null;
    }

    const jsonData: BlogDetailApiResponse = await response.json();
    
    if (jsonData && jsonData.success && jsonData.post) {
      return jsonData.post;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching blog post for schema:", error);
    return null;
  }
}

// Generate metadata in layout
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getBlogPostForSchema(slug);

    if (!post) {
      return {
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found",
      };
    }

    return {
      title: post.title,
      description: post.excerpt || post.title,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      description: "Blog post page",
    };
  }
}

const layout = async ({ 
  children,
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  try {
    const { slug } = await params;
    const post = await getBlogPostForSchema(slug);

    // Generate schema scripts from API response
    const schemaScripts = post?.schema && Array.isArray(post.schema) ? post.schema : [];

    return (
      <>
        {/* Add schema from API response */}
        {schemaScripts.length > 0 && schemaScripts.map((schema, index) => {
          // Validate schema is a valid object
          if (!schema || typeof schema !== 'object') return null;
          
          return (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
          );
        })}
        
        {/* Fallback schema if API doesn't provide one */}
        {post && (!post.schema || !Array.isArray(post.schema) || post.schema.length === 0) && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title || "",
                "description": post.excerpt || post.title || "",
                "image": post.featuredImage || "",
                "datePublished": post.publishedAt || "",
                "dateModified": post.updatedAt || post.publishedAt || "",
                "author": {
                  "@type": "Person",
                  "name": post.author?.username || "",
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Your Company Name",
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/blog/${post.slug || slug}`,
                },
              }),
            }}
          />
        )}
        
        <div>{children}</div>
      </>
    );
  } catch (error) {
    console.error("Error in blog layout:", error);
    // Return children even if schema generation fails
    return <div>{children}</div>;
  }
};

export default layout;