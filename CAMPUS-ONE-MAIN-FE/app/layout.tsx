import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus One",
  description: "University domain registration and institutional management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
