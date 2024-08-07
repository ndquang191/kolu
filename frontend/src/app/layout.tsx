import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Kolu",
	description: "Kolu is a free and open source alternative to Notion.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Head>
				<title>Kolu</title>
			</Head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
