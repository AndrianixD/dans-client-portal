import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portal.dansautobodyma.com"),
  title: {
    default: "Dan's Auto Body | Client Portal",
    template: "%s | Dan's Auto Body",
  },
  description:
    "Access your vehicle repair status, updates, and contact Dan's Auto Body directly through the client portal.",
  keywords: [
    "Dan's Auto Body",
    "client portal",
    "repair status",
    "auto body repair",
    "vehicle updates",
    "Peabody MA",
  ],
  openGraph: {
    type: "website",
    title: "Dan's Auto Body | Client Portal",
    description:
      "Access your vehicle repair status, updates, and contact Dan's Auto Body directly through the client portal.",
    url: "https://portal.dansautobodyma.com",
    siteName: "Dan's Auto Body Client Portal",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 628,
        alt: "Dan's Auto Body",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dan's Auto Body | Client Portal",
    description:
      "Access your vehicle repair status, updates, and contact Dan's Auto Body directly through the client portal.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
