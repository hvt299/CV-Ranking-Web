import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "ATS Dashboard",
  description: "Hệ thống quản lý và xếp hạng CV",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
