"use client";

import type React from "react";
import Login from "./Login";

export default function Theme() {
	const handleClick = () => {
		document.documentElement.classList.toggle("dark");
		if (document.documentElement.className.includes("dark")) {
			localStorage.setItem("theme", "dark");
		} else {
			localStorage.setItem("theme", "light");
		}
	};

	const handleKeyUp = (e: React.KeyboardEvent) => {
		if (e.key === "t" && (e.ctrlKey || e.altKey || e.shiftKey)) handleClick();
	};

	// Copied from https://uiverse.io/cuzpq/gentle-goat-72
	return (
		<div className="w-full h-5 flex items-center justify-end absolute mt-6 pr-10">
			<input
				id="theme"
				type="checkbox"
				className="theme-checkbox mr-3"
				onClick={handleClick}
				onKeyUp={handleKeyUp}
			/>
			<Login />
		</div>
	);
}
