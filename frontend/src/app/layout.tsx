import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/FOOTER/Footer";
import { GoogleMapsProvider } from "@/context/GoogleMapsContext"; // ✅ Import Google Maps Provider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleMapsProvider> {/* ✅ Wrap the app in the provider */}
          <div className="relative w-full flex items-center justify-center border-white">
            <Navbar />
          </div>
          {children}
          <Footer />
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
