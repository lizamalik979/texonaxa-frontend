import { HeaderMenuApiResponse } from "../types/header";

export async function fetchHeaderMenu(): Promise<HeaderMenuApiResponse | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://texonaxa-cms.vercel.app";
    const response = await fetch(`${apiUrl}/api/header-menu`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch header menu:", response.status, response.statusText);
      return null;
    }

    const data: HeaderMenuApiResponse = await response.json();

    if (data && data.success && data.headerMenu) {
      return data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching header menu:", error);
    return null;
  }
}

