import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppLayout } from "@/components/AppLayout";
import { AuthProvider } from "@/components/auth/AuthContext";
import { getSession } from "@/lib/auth/session";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ummy",
  description: "Ummy - Social collaboration platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {session ? (
          <AuthProvider user={session.user}>
            <AppLayout>{children}</AppLayout>
          </AuthProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
