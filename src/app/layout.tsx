import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientStoreProvider from "@/components/providers/ClientStoreProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Foody Buddy - Delicious Food Delivered Fresh",
  description: "Experience the finest flavors from our kitchen to your doorstep. Premium quality food with fast delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientStoreProvider>
          {children}
        </ClientStoreProvider>
      </body>
    </html>
  );
}
