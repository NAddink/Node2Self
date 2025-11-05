import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Node2Self",
  description: "Created By Noah Addink",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
