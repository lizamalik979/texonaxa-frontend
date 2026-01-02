"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchFooterMenu } from "../utils/footerMenu";
import { MainMenu, ContactDetail } from "../types/footer";

interface FooterMenuContextValue {
  menuData: MainMenu[];
  contactDetails: ContactDetail[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const FooterMenuContext = createContext<FooterMenuContextValue | null>(null);

const CACHE_KEY = "footer_menu_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedData {
  menuData: MainMenu[];
  contactDetails: ContactDetail[];
  timestamp: number;
}

export function useFooterMenu() {
  const context = useContext(FooterMenuContext);
  if (!context) {
    throw new Error("useFooterMenu must be used within FooterMenuProvider");
  }
  return context;
}

export default function FooterMenuProvider({ children }: { children: ReactNode }) {
  const [menuData, setMenuData] = useState<MainMenu[]>([]);
  const [contactDetails, setContactDetails] = useState<ContactDetail[]>([]);
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
              setMenuData(parsedCache.menuData);
              setContactDetails(parsedCache.contactDetails);
              setIsLoading(false);
              return; // Use cached data, no API call needed
            }
          } catch (e) {
            // Invalid cache, continue to fetch
            console.warn("Failed to parse cached footer menu data", e);
          }
        }
      }

      // Fetch from API
      const response = await fetchFooterMenu();
      if (response && response.footerMenu) {
        const menuData = response.footerMenu.main_menu;
        const contactDetails = response.footerMenu.contact_details || [];
        setMenuData(menuData);
        setContactDetails(contactDetails);

        // Cache the data in sessionStorage
        if (typeof window !== "undefined") {
          const cacheData: CachedData = {
            menuData,
            contactDetails,
            timestamp: Date.now(),
          };
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        }
      } else {
        throw new Error("Failed to fetch footer menu data");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      console.error("Error loading footer menu data:", error);
      
      // Try to use cached data as fallback even if expired
      if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const parsedCache: CachedData = JSON.parse(cached);
            setMenuData(parsedCache.menuData);
            setContactDetails(parsedCache.contactDetails);
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
    <FooterMenuContext.Provider value={{ menuData, contactDetails, isLoading, error, refetch }}>
      {children}
    </FooterMenuContext.Provider>
  );
}

