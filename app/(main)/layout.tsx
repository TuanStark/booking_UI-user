import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import SupportChatWidget from "@/components/chat/SupportChatWidget";

interface MainLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "KTX Online",
  description: "Hệ thống đặt phòng ký túc xá",
  keywords: ["ký túc xá", "đặt phòng", "sinh viên", "dormitory"],
  authors: [{ name: "KTX Online Team" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "KTX Online",
    description: "Hệ thống đặt phòng ký túc xá",
    type: "website",
  },
  icons: {
    icon: "/logoDorm.png",
  },
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <div>
      <SupportChatWidget />
      <ChatbotWidget />
      </div>
      <Footer />
    </div>
  );
}
