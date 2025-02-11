"use client";
import type React from "react";
import { useState } from "react";

export default function Input(params: {
	handleSubmit: (link: string) => void;
}) {
	const [link, setLink] = useState("");

	const handleKeyUp = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			params.handleSubmit(link);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLink(e.target.value);
	};

	// Modified version of https://uiverse.io/emmanuelh-dev/plastic-rattlesnake-49
	return (
		<div className="flex items-center justify-center p-5 w-full max-w-4xl">
			<div className="rounded-xl p-1 w-full">
				<div className="shadow-md transition-shadow duration-300 rounded-lg">
					<div className="flex relative overflow-hidden">
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: handled in textbox */}
						<div
							className="flex w-10 items-center justify-center rounded-tl-xl rounded-bl-xl border-r border-gray-200 bg-secondary-light p-5 hover:cursor-pointer hover:bg-secondary-dark transition-colors duration-300"
							onClick={() => {
								params.handleSubmit(link);
							}}
						>
							<svg
								viewBox="0 0 20 20"
								aria-hidden="true"
								className="pointer-events-none absolute w-5 fill-light transition"
							>
								<path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z" />
							</svg>
						</div>
						<input
							type="text"
							className="w-full bg-light pl-3 font-semibold border-0 text-dark outline-none focus:px-4 duration-300"
							value={link}
							onChange={handleChange}
							onKeyUp={handleKeyUp}
							placeholder="Spotify Playlist Link"
							id="input"
						/>
						<input
							type="button"
							value="Convert"
							className="bg-primary-light p-2 rounded-tr-xl rounded-br-xl text-white font-semibold hover:cursor-pointer hover:bg-primary-dark transition-colors duration-300"
							onClick={() => {
								params.handleSubmit(link);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
