import type { Metadata } from "next";
import "./globals.css";
import RecordingBadge from "./components/RecordingBadge";

export const metadata: Metadata = {
  title: "Language assessment",
  description: "Candidate language assessment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RecordingBadge />
        {children}
      </body>
    </html>
  );
}