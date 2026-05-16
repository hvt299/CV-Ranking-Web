import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "ATS Dashboard | Tuyển dụng thông minh",
  description: "Hệ thống quản lý và xếp hạng CV bằng trí tuệ nhân tạo",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              {/* ĐÃ GỠ BỎ <DashboardLayout> Ở ĐÂY */}
              {/* BỌC MAIN LAYOUT Ở ĐÂY: Sẽ tự động phân luồng giao diện theo Role */}
              <MainLayout>
                {children}
              </MainLayout>
            </AuthProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
