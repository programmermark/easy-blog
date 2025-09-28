import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/header";

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "700"],
  variable: "--font-cn",
  display: "swap",
  preload: false, // 中文字体很大，建议不要预加载
});

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
      <body className={`${notoSansSC.variable} antialiased h-full`}>
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
