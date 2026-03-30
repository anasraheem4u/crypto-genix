import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Crypto Genix",
  description: "The next-generation crypto trading platform — trade smarter, profit faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors theme="dark" />
        </AuthProvider>
      </body>
    </html>
  );
}


