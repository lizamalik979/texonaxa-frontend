"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2, ExternalLink, ArrowRight } from 'lucide-react';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ["300", "400", "500", "600", "700"],
});

interface BlogPost {
    id: string;
    title: string;
    featuredImage: string | null;
    publishedAt: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    author: {
        _id: string;
        username: string;
        email: string;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface FilterApiResponse {
    success: boolean;
    categories?: Category[];
    count?: number;
}

interface SearchApiResponse {
    success: boolean;
    posts?: BlogPost[];
    count?: number;
    message?: string;
}

interface SearchBarProps {
    onSearchResults?: (results: BlogPost[]) => void;
    onSearchError?: (error: string) => void;
    onCategoryClick?: (category: Category) => void;
}

export default function SearchBar({ onSearchResults, onSearchError, onCategoryClick }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<BlogPost[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001";
                const response = await fetch(`${apiUrl}/api/post/client/filter`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data: FilterApiResponse = await response.json();
                
                if (data.success && data.categories) {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Debounced search function
    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setShowResults(false);
            setIsLoading(false);
            if (onSearchResults) {
                onSearchResults([]);
            }
            return;
        }

        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001";
            const response = await fetch(`${apiUrl}/api/post/client/search?q=${encodeURIComponent(searchQuery)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data: SearchApiResponse = await response.json();

            if (data.success && data.posts) {
                setResults(data.posts);
                setShowResults(true);
                if (onSearchResults) {
                    onSearchResults(data.posts);
                }
            } else {
                setResults([]);
                setShowResults(true);
                if (onSearchResults) {
                    onSearchResults([]);
                }
            }
        } catch (error) {
            console.error('Error searching:', error);
            setResults([]);
            setShowResults(false);
            if (onSearchError) {
                onSearchError(error instanceof Error ? error.message : 'An error occurred while searching');
            }
        } finally {
            setIsLoading(false);
        }
    }, [onSearchResults, onSearchError]);

    // Debounce effect - waits 500ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                performSearch(query);
            } else {
                setResults([]);
                setShowResults(false);
                setIsLoading(false);
            }
        }, 500); // 500ms debounce delay

        return () => clearTimeout(timer);
    }, [query, performSearch]);

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
        if (onSearchResults) {
            onSearchResults([]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <div className="w-full mx-auto py-4">
            {/* Search Input Container */}
            <div className="relative max-w-[1200px] mx-auto">
                {/* Search Input */}
                <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Search for latest blogs"
                        className={`w-full pl-12 pr-12 py-3 rounded-xl bg-gradient-to-b from-[rgba(19,19,19,0.9)] to-[rgba(19,18,18,0.45)] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all ${poppins.className}`}
                    />

                    {query && (
                        <button
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {showResults && query && (
                    <div className="absolute top-full left-0 right-0 mt-2 w-full rounded-xl bg-black border border-white/10 shadow-2xl z-50 max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                <p className={`text-sm ${poppins.className}`}>Searching...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="py-2">
                                {results.map((post) => (
                                    <a
                                        key={post.slug}
                                        href={`/blog/${post.slug}`}
                                        className="block px-4 py-3 flex items-center justify-between hover:bg-white/9 transition-colors border-b border-white/5 last:border-b-0"
                                    >
                                        <h4 className={`text-white font-semibold mb-1 line-clamp-1 ${poppins.className}`}>
                                            {post.title}
                                        </h4>
                                        <ExternalLink className="size-6" />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-400">
                                <p className={`text-sm ${poppins.className}`}>No results found for "{query}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Frequently Searched Categories Section */}
            <div className="max-w-[1200px] mx-auto mt-6">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <p className={`text-base font-bold text-white flex-shrink-0 ${poppins.className}`}>
                        Frequently Searched:
                    </p>

                    {/* Category Tags or Skeleton */}
                    {isLoadingCategories ? (
                        <>
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={`skeleton-${index}`}
                                    className="h-9 w-40 rounded-full bg-gray-800/50  animate-pulse"
                                />
                            ))}
                        </>
                    ) : categories.length > 0 ? (
                        categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/blog/category/${category.slug}`}
                                className={`px-4 py-2 text-xs rounded-full bg-gray-800/50 border border-white/10 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-white/20 transition-all cursor-pointer flex-shrink-0 ${poppins.className}`}
                            >
                                {category.name}
                            </Link>
                        ))
                    ) : null}
                </div>
            </div>
        </div>
    );
}