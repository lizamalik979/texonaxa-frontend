import { FooterMenuApiResponse } from "../types/footer";

export async function fetchFooterMenu(): Promise<FooterMenuApiResponse | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://texonaxa-cms.vercel.app";
    const response = await fetch(`${apiUrl}/api/footer-menu`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch footer menu:", response.status, response.statusText);
      return null;
    }

    const data: FooterMenuApiResponse = await response.json();

    if (data && data.success && data.footerMenu) {
      return data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching footer menu:", error);
    return null;
  }
}

