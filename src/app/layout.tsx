import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kyster",
  description: "Welcome to the Kyster World",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}