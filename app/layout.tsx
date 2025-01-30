import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CryptoWorker } from "@/components/workers/CryptoWorker";
import { HandshakeWorker } from "@/components/workers/HandshakeWorker";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Vanish",
    description: "One time E2EE messenger",
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
                <CryptoWorker />
                <HandshakeWorker />
                {children}
            </body>
        </html>
    );
}
