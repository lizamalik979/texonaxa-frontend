
import Link from 'next/link';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
});

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
  description?: string; // Optional if API provides it
}

interface BlogListingProps {
  posts: BlogPost[];
}

export default function BlogListing({ posts }: BlogListingProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">No blog posts available at the moment.</p>
      </div>
    );
  }

  // First post is the featured one (left side)
  const featuredPost = posts[0];
  // Remaining posts go to the right side (3-4 posts)
  const sidebarPosts = posts.slice(1, 5);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  const description = featuredPost.description ? featuredPost.description : featuredPost.excerpt;

  return (
    <section className="w-full mx-auto p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with View All */}
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-xl sm:text-3xl font-semibold text-white ${poppins.className}`}>
            What's New
          </h2>
        </div>

        {/* Main Layout: Featured Post (Left) + Sidebar Posts (Right) */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center">
          {/* Featured Post - Left Side (max-width: 550px) */}
          <div className="w-full lg:max-w-[550px]">
            <article className="group relative h-full  rounded-2xl overflow-hidden bg-gradient-to-b from-[rgba(19,19,19,0.9)] to-[rgba(19,18,18,0.45)] hover:opacity-90 transition-all duration-300">
              {/* Featured Image */}
              {featuredPost.featuredImage ? (
                <div className="relative w-full max-h-[300px] overflow-hidden">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105  transition-transform duration-500"
                  />
                  {/* Overlay with hexagonal pattern effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    {/* Hexagonal overlay pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white/30 rotate-45"></div>
                      <div className="absolute top-12 right-12 w-12 h-12 border-2 border-white/20 rotate-45"></div>
                      <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-white/25 rotate-45"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-[400px] bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
              )}

              {/* Content */}
              <div className="px-4 py-6 md:px-6 md:py-8 space-y-2">
                <Link href={`/blog/${featuredPost.slug}`}>
                <h3 className={`text-base sm:text-lg font-bold text-white  line-clamp-2 group-hover:text-[#FEE39A] transition-colors ${poppins.className}`}>
                  {featuredPost.title}
                </h3>
                </Link>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4">
                  {featuredPost.publishedAt && (
                    <p className={`text-xs text-gray-400 ${poppins.className}`}>
                      {formatDate(featuredPost.publishedAt)}
                    </p>
                  )}
                  {featuredPost.author && (
                    <p className={`text-xs text-gray-400 ${poppins.className}`}>
                      {featuredPost.author.username}
                    </p>
                  )}
                </div>

                {/* Description */}
                {description ? (
                  <p className={`text-sm text-white/80  line-clamp-3 ${poppins.className}`}>
                    {description}
                  </p>
                ) : (
                  <p className={`text-sm text-white/80 line-clamp-3 ${poppins.className}`}>
                    {featuredPost.title} - Read more about this topic and discover insights.
                  </p>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar Posts - Right Side (max-width: 600px) */}
          <div className="w-full lg:max-w-[600px] flex flex-col gap-4">
            {sidebarPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article
                  className="group relative flex flex-row items-center gap-4 rounded-xl overflow-hidden bg-gradient-to-b from-[rgba(19,19,19,0.9)] to-[rgba(19,18,18,0.45)] hover:opacity-90 transition-all duration-300 cursor-pointer"
                >
                  {/* Image Section - Left Side (40-50% width, 254px x 133px) */}
                  {post.featuredImage ? (
                    <div className="relative w-[254px] h-[133px] flex-shrink-0 overflow-hidden rounded-[12px]">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay with hexagonal pattern */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent">
                        {/* Hexagonal overlay pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-1 right-1 w-6 h-6 border-2 border-white/30 rotate-45"></div>
                          <div className="absolute bottom-1 left-1 w-4 h-4 border-2 border-white/20 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-[254px] h-[133px] flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[12px] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                    </div>
                  )}

                  {/* Content Section - Right Side (50-60% width) */}
                  <div className="flex flex-col justify-between flex-1 min-w-0 min-h-[133px]">
                    <div className="flex-1 flex flex-col justify-center space-y-3">
                      {/* Date */}
                      {post.publishedAt && (
                        <p className={`text-xs text-gray-400  ${poppins.className}`}>
                          {formatDate(post.publishedAt)}
                        </p>
                      )}
                      
                      {/* Title */}
                      <h4 className={`text-base sm:text-lg font-bold text-white  line-clamp-2 group-hover:text-[#FEE39A] transition-colors ${poppins.className}`}>
                        {post.title}
                      </h4>
                      
                      {/* Author */}
                      {post.author && (
                        <div className="flex items-center gap-2">
                          <p className={`text-xs text-gray-400 ${poppins.className}`}>
                            {post.author.username}
                          </p>
                        </div>
                      )}
                    </div>
                  
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}