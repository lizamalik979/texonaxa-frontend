import type { Metadata } from "next";
import "./globals.css";
import StarBackground from "./components/StarBackground";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import LeadModalProvider from "./components/leads/LeadModalProvider";
import HeaderMenuProvider from "./contexts/HeaderMenuContext";
import FooterMenuProvider from "./contexts/FooterMenuContext";
import { SectionProvider } from "./contexts/SectionContext";
import MouseGradient from "./components/common/MouseGradient";

export const metadata: Metadata = {
  title: "Shooting Stars",
  description: "Interactive shooting stars experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Fixed background with shooting stars */}
        <StarBackground />
        
        {/* Content above the background */}
        <div className="relative z-10">
          <HeaderMenuProvider>
            <FooterMenuProvider>
              <LeadModalProvider>
                <SectionProvider>
                  <MouseGradient />
                  <Header />
                  {children}
                  <Footer />
                </SectionProvider>
              </LeadModalProvider>
            </FooterMenuProvider>
          </HeaderMenuProvider>
        </div>
      </body>
    </html>
  );
}
