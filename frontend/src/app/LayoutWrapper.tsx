"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/FOOTER/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide Navbar and Footer only on /blog (the Reels page)
  const hideLayout = pathname === "/blog";

  return (
    <>
      {!hideLayout && (
        <div className="relative w-full flex items-center justify-center border-white">
          <Navbar />
        </div>
      )}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
