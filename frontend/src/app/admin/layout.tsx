import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className={inter.className}>
			<Head>
				<title>Kolu</title>
			</Head>
			<Header />
			<div className="flex">
				<Sidebar />
				<Toaster />
				{children}
			</div>
		</section>
	);
}
