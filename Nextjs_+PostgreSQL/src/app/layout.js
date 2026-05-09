import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from '../providers/ReduxProvider';
import { AppContextProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoriesSection from "@/components/CategoriesSection";
import { Providers } from "./providers";
import GlobalSessionGuard from "@/components/auth/GlobalSessionGuard";
import PageContentWrapper from "@/components/PageContentWrapper";
import { getCategories } from "@/utils/utilities";
import SearchModal from "@/components/modals/SearchModal";
import AlertModal from "@/components/modals/AlertModal";
import Script from "next/script";
import GlobalToast from "@/components/ui/GlobalToast";
import SidebarWrapper from "@/components/SidebarWrapper";

const inter = Inter({
  variable: "--font-inter", // optional
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins", // optional
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "FK Store | Full-Stack eCommerce App",
  description:
    "A full-stack eCommerce web application built with Next.js, React, Node.js, and MongoDB. Features include authentication, admin dashboard, inventory management, and complete order workflow.",
  openGraph: {
    title: "FK Store",
    description: "Full-stack eCommerce app built with Next.js",
    url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    siteName: "FK Store",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const categories = await getCategories();
  return (
    <html
      lang="en"
      className="dark overflow-y-scroll"
      suppressHydrationWarning
    >
      {/* <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const theme = localStorage.getItem("theme");
              const root = document.documentElement;
              if (theme === "dark") {
                root.classList.add("dark");
              } else if (theme === "light") {
                root.classList.remove("dark");
              } else {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                root.classList.toggle("dark", prefersDark);
              }
            })();
          `,
          }}
        />
      </head> */}
      <body
        className={`${inter.variable} ${poppins.variable} antialiased w-full  min-h-screen flex flex-col`}
      >
        <Providers>
          <GlobalSessionGuard />
          <SidebarWrapper />
          {/* FIXED HEADER OUTSIDE CONTAINER */}
          <Header />
          <CategoriesSection categories={categories} />

          <SearchModal />
          <AlertModal />

          {/* Page content wrapper */}
          <PageContentWrapper categories={categories}>
            {children}
          </PageContentWrapper>
          <GlobalToast />

          <Footer />

        </Providers>
      </body>
    </html>
  );
}
