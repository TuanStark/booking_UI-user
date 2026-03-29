import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import SupportChatWidget from "@/components/chat/SupportChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "KTX Online - Hệ Thống Đặt Phòng Ký Túc Xá",
  description: "Modern dormitory booking platform for university students",
  keywords: ["dormitory", "booking", "university", "student", "accommodation"],
  authors: [{ name: "KTX Online Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <SupportChatWidget />
          <ChatbotWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
