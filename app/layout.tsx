
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/conditional-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Updated the metadata to reflect your new high-end app name!
export const metadata: Metadata = {
  title: "PathoLens | AI Medical Intelligence Hub",
  description: "AI-powered lab report analysis, health chatbot, and secure notes for better health literacy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Added flex, flex-col, and min-h-screen to ensure the footer sticks to the bottom */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50/30`}
      >
        {/* Main Application Area */}
        <div className="flex-grow flex flex-col">
          <ConditionalLayout>{children}</ConditionalLayout>
        </div>

        {/* Global Professional Footer */}
        <footer className="w-full border-t border-gray-200 bg-white py-6 mt-auto shrink-0 relative z-50">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-gray-900">PathoLens</p>
            <p className="mt-1">© {new Date().getFullYear()} PathoLens. All rights reserved.</p>
            <p className="mt-3 text-xs text-gray-500 max-w-3xl mx-auto leading-relaxed">
              <strong className="font-medium text-gray-700">Disclaimer:</strong> PathoLens utilizes Artificial Intelligence to parse and summarize data. It is an organizational tool and is not intended to substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding your medical conditions.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
