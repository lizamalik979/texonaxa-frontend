"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchHeaderMenu } from "../utils/headerMenu";
import { MainMenu } from "../types/header";

interface HeaderMenuContextValue {
  menuData: MainMenu[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const HeaderMenuContext = createContext<HeaderMenuContextValue | null>(null);

const CACHE_KEY = "header_menu_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedData {
  data: MainMenu[];
  timestamp: number;
}

export function useHeaderMenu() {
  const context = useContext(HeaderMenuContext);
  if (!context) {
    throw new Error("useHeaderMenu must be used within HeaderMenuProvider");
  }
  return context;
}

export default function HeaderMenuProvider({ children }: { children: ReactNode }) {
  const [menuData, setMenuData] = useState<MainMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMenuData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check sessionStorage cache first
      if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const parsedCache: CachedData = JSON.parse(cached);
            const now = Date.now();
            
            // Check if cache is still valid (within 5 minutes)
            if (now - parsedCache.timestamp < CACHE_DURATION) {
              setMenuData(parsedCache.data);
              setIsLoading(false);
              return; // Use cached data, no API call needed
            }
          } catch (e) {
            // Invalid cache, continue to fetch
            console.warn("Failed to parse cached menu data", e);
          }
        }
      }

      // Fetch from API
      const response = await fetchHeaderMenu();
      if (response && response.headerMenu) {
        const data = response.headerMenu.main_menu;
        setMenuData(data);

        // Cache the data in sessionStorage
        if (typeof window !== "undefined") {
          const cacheData: CachedData = {
            data,
            timestamp: Date.now(),
          };
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        }
      } else {
        throw new Error("Failed to fetch menu data");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      console.error("Error loading menu data:", error);
      
      // Try to use cached data as fallback even if expired
      if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const parsedCache: CachedData = JSON.parse(cached);
            setMenuData(parsedCache.data);
          } catch (e) {
            // Ignore cache parse errors
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  const refetch = async () => {
    // Clear cache and refetch
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(CACHE_KEY);
    }
    await loadMenuData();
  };

  return (
    <HeaderMenuContext.Provider value={{ menuData, isLoading, error, refetch }}>
      {children}
    </HeaderMenuContext.Provider>
  );
}

