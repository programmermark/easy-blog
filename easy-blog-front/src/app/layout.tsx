import type { Metadata } from "next";
import "../styles/fonts.css";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "爱编程的Mark - 持续分享的前端工程师",
  description: "爱编程的Mark - 持续分享的前端工程师",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="font-noto antialiased h-full">
        <Providers>
          <div className="w-full h-full flex flex-col">
            <Header />
            <main className="flex-1 bg-gray-100 overflow-y-auto scrollbar-custom">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
