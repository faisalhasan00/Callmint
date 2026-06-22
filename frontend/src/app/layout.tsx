import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL('https://callmint.ai'),
  title: {
    default: "Callmint — AI Voice Employee for Local Businesses",
    template: "%s | Callmint"
  },
  description:
    "A human-like AI voice assistant that handles phone calls, books appointments, and runs promotional campaigns for salons and supermarkets in Telugu, Hindi, and Hinglish.",
  keywords: ["AI Voice Assistant", "Call Center Automation", "Outbound Dialer", "AI Appointment Booking", "India AI Voice"],
  authors: [{ name: "Callmint Team" }],
  creator: "Callmint",
  publisher: "Callmint",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Callmint — AI Voice Employee for Local Businesses",
    description: "A human-like AI voice assistant that handles phone calls, books appointments, and runs promotional campaigns.",
    url: "https://callmint.ai",
    siteName: "Callmint",
    images: [
      {
        url: "/Logos/callmint-primary-logo.png",
        width: 1200,
        height: 630,
        alt: "Callmint AI Voice Agent",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Callmint — AI Voice Employee",
    description: "Automate your phone support and sales with Callmint's human-like AI.",
    images: ["/Logos/callmint-primary-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: "#ffffff", color: "#0f172a" }}>
        {children}
      </body>
    </html>
  );
}
