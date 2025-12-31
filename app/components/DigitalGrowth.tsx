"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { poppins } from "../fonts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string | null;
  publishedAt: string;
  excerpt: string;
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
import { useSection } from "../contexts/SectionContext";

export default function DigitalGrowth() {
  const { setActiveSection } = useSection();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://texonaxa-cms.vercel.app";
        const response = await fetch(`${apiUrl}/api/post/client/all-blog`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data: BlogApiResponse = await response.json();
        
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    }),
  };

  return (
    <motion.section
      className="w-full py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      onMouseEnter={() => setActiveSection("digitalGrowth")}
      onMouseLeave={() => setActiveSection("default")}
    >
      <motion.div className="max-w-[1920px] mx-auto" variants={fadeInUp} custom={0}>
        {/* Header */}
        <motion.div className="text-center mb-16" variants={fadeInUp} custom={0.05}>
          <motion.h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 ${poppins.className}`}
            variants={fadeInUp}
            custom={0.08}
          >
            Fresh Perspectives on Branding & Digital Growth
          </motion.h2>
          <motion.p
            className={`text-white text-base md:text-xl opacity-80 ${poppins.className}`}
            variants={fadeInUp}
            custom={0.12}
          >
            Transform your brand with our innovative digital solutions that captivate and engage your audience.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          className="relative"
          variants={fadeInUp}
          custom={0.15}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className={`text-white ${poppins.className}`}>Loading blog posts...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className={`text-red-400 ${poppins.className}`}>{error}</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className={`text-white opacity-70 ${poppins.className}`}>No blog posts available</div>
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: posts.length > 3,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {posts.map((post, index) => (
                  <CarouselItem key={post.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      className="flex flex-col gap-0 items-center"
                      variants={fadeInUp}
                      custom={0.2 + index * 0.05}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                    >
                      {/* Image Section - Using featuredImage from API */}
                      <div className="relative max-w-72 max-h-72 w-full aspect-square rounded-2xl overflow-hidden">
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-green-400/30 to-yellow-300/40">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/50 via-green-400/40 to-yellow-300/50"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-32 h-48 bg-gray-800/80 rounded-lg shadow-2xl border border-gray-700/50"></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Section - Completely Separate Below */}
                      <div className="max-w-[320px] py-8 bg-transparent flex flex-col gap-4">
                        {/* Date */}
                        <p className={`text-white text-sm opacity-70 ${poppins.className}`}>
                          {formatDate(post.publishedAt)}
                        </p>

                        {/* Title */}
                        <h3 className={`text-white text-xl font-bold ${poppins.className}`}>
                          {post.title}
                        </h3>

                        {/* Description - Using excerpt from API */}
                        <p className={`text-white text-sm opacity-80 line-clamp-2 ${poppins.className}`}>
                          {post.excerpt}
                        </p>

                        {/* Read More Button - Link to blog post */}
                        <Link 
                          href={`/blog/${post.slug}`}
                          className={`w-full py-3 px-6 bg-transparent border border-[#FEE39A] rounded-lg hover:border-[#FEE39A] hover:bg-[#FEE39A]/10 transition-all duration-300 text-center ${poppins.className}`}
                        >
                          <span className="text-[#FEE39A] text-base font-medium">
                            Read More
                          </span>
                        </Link>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-12 bg-black/50 border-gray-800 text-white hover:bg-black/70 hover:text-white" />
              <CarouselNext className="-right-12 bg-black/50 border-gray-800 text-white hover:bg-black/70 hover:text-white" />
            </Carousel>
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

