import "@/app/globals.css";
import { buildEnv } from "@cap/env";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import type { PropsWithChildren } from "react";

const defaultFont = localFont({
	src: [
		{
			path: "../public/fonts/NeueMontreal-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../public/fonts/NeueMontreal-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/NeueMontreal-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../public/fonts/NeueMontreal-MediumItalic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "../public/fonts/NeueMontreal-Italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../public/fonts/NeueMontreal-BoldItalic.woff2",
			weight: "700",
			style: "italic",
		},
	],
	preload: false,
});

// Self-hosted instances (NEXT_PUBLIC_IS_CAP unset) brand as RAGnos Video and
// resolve relative metadata against their own origin instead of cap.so.
export const metadata: Metadata = buildEnv.NEXT_PUBLIC_IS_CAP
	? {
			metadataBase: new URL("https://cap.so"),
			title: "Cap — Beautiful screen recordings, owned by you.",
			description:
				"Cap is the open source alternative to Loom. Lightweight, powerful, and cross-platform. Record and share in seconds.",
			openGraph: {
				title: "Cap — Beautiful screen recordings, owned by you.",
				description:
					"Cap is the open source alternative to Loom. Lightweight, powerful, and cross-platform. Record and share in seconds.",
				type: "website",
				url: "https://cap.so",
				images: ["https://cap.so/og.png"],
			},
		}
	: {
			metadataBase: new URL(buildEnv.NEXT_PUBLIC_WEB_URL),
			title: "RAGnos Video",
			description: "Screen recordings from RAGnos Labs.",
		};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html className={defaultFont.className} lang="en">
			<head>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0D1117" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<meta name="msapplication-TileColor" content="#da532c" />
				<meta name="theme-color" content="#ffffff" />
			</head>
			<body suppressHydrationWarning>
				<Script src="/theme-script.js" strategy="beforeInteractive" />
				<main className="w-full">{children}</main>
			</body>
		</html>
	);
}
