"use client";

import Cookies from "js-cookie";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

// Standalone light/dark toggle for share and embed pages. The theme class
// lives on <body> (applied pre-paint by theme-script.js); this button flips
// the class and persists the choice in the same cookie the dashboard uses.
export const ThemeToggle = () => {
	const [theme, setTheme] = useState<"light" | "dark" | null>(null);

	useEffect(() => {
		setTheme(document.body.classList.contains("dark") ? "dark" : "light");
	}, []);

	const toggle = () => {
		const current = document.body.classList.contains("dark")
			? "dark"
			: "light";
		const next = current === "dark" ? "light" : "dark";
		document.body.classList.remove(current);
		document.body.classList.add(next);
		Cookies.set("theme", next, { expires: 365 });
		setTheme(next);
	};

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={
				theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
			}
			className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gray-5 bg-gray-1 text-gray-11 transition-colors hover:bg-gray-3 hover:text-gray-12"
		>
			{theme === "dark" ? (
				<Sun className="size-4" />
			) : (
				<Moon className="size-4" />
			)}
		</button>
	);
};
