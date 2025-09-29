import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientStoreProvider from "@/components/providers/ClientStoreProvider";
import { SidebarProvider } from "@/contexts/SidebarContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Foody Buddy",
  description: "Experience the finest flavors from our kitchen to your doorstep. Premium quality food with fast delivery.",
  icons: {
    icon: '/favicon.svg',
  },
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
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ClientStoreProvider>
      </body>
    </html>
  );
}
