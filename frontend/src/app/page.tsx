"use client";

import Link from "next/link";
import Input from "./components/Input";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
	useEffect(() => {
		if (typeof window !== "undefined") {
			if (localStorage.getItem("theme") === "light") {
				document.documentElement.classList.remove("dark");
				const themeButton = document.getElementById(
					"theme",
				) as HTMLInputElement;
				if (themeButton) themeButton.checked = true;
			}
		}
		const container = document.getElementById("container");
		if (container) {
			setTimeout(() => {
				container.classList.remove("opacity-0");
			}, 500);
		}
	}, []);

	const [playlist, setPlaylist] = useState("");

	const { data: session } = useSession();

	const handleSubmit = (link: string) => {
		setPlaylist("This may take a while depending on the playlist's size");
		const linkArray = link.split("/");
		const linkId = linkArray[linkArray.length - 1].split("?")[0];

		fetch(`https://api.convert-playlists.taqi.dev/to-ytm/${linkId}`, {
			method: "POST",
			body: JSON.stringify(session),
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
			},
			mode: "cors",
		})
			.then((res) => {
				res.json().then((data) => {
					if (typeof data.playlist !== "string") {
						setPlaylist("ensure your account has a channel");
					} else setPlaylist(data.playlist);
					if (
						playlist ===
						"Server returned HTTP 403: Forbidden.\nRequest had insufficient authentication scopes."
					) {
						setPlaylist(
							"Error 403: Log in again and give permission to manage your youtube channel",
						);
					} else if (!res.ok) {
						if (res.status === 429) {
							setPlaylist("You've reached the rate limit, try again later");
						}
						setPlaylist("an error occurred");
					}
				});
			})
			.catch(() => {
				setPlaylist("Invalid Link/Private Playlist");
			});
	};

	const errors = [
		"You've reached the rate limit, try again later",
		"Invalid Link/Private Playlist",
		"an error occurred",
		"ensure your account has a channel",
		"Error 403: Log in again and give permission to manage your youtube channel",
	];

	return (
		<main className="flex flex-col items-center align-middle justify-center p-24">
			<div className="opacity-0 transition-opacity duration-300" id="container">
				{session ? (
					session.scope.includes("https://www.googleapis.com/auth/youtube") ? (
						<div>
							<div>
								<h2 className="text-center">
									<span className="text-primary-light">Spotify</span> To{" "}
									<span className="text-secondary-light">Youtube Music</span>
								</h2>
								<h1 className="pb-8 pt-1 text-center"> Playlists Converter</h1>
							</div>
							<Input handleSubmit={handleSubmit} />
							{playlist !==
							"This may take a while depending on the playlist's size" ? (
								playlist && !errors.includes(playlist) ? (
									<Link
										className="hover:text-secondary-light duration-200"
										target="_blank"
										href={`https://music.youtube.com/playlist?list=${playlist}`}
									>
										<p className="text-center">{`https://music.youtube.com/playlist?list=${playlist}`}</p>
									</Link>
								) : (
									<p className="text-center">{playlist}</p>
								)
							) : (
								<div className="flex flex-col mt-1 gap-2 items-center justify-center">
									<div className="loader">
										<li className="ball" />
										<li className="ball" />
										<li className="ball" />
									</div>
									<p className="text-center">{playlist}</p>
								</div>
							)}
						</div>
					) : (
						<div className="flex flex-col justify-center items-center gap-4">
							<div>
								<h2 className="pb-1 text-center">
									Permission to manage youtube
								</h2>
								<h4 className="opacity-70 text-center">
									sign out, and sign in again to give permission
								</h4>
							</div>
							<button
								type="button"
								onClick={() => signOut()}
								className="px-4 py-1 text-white rounded-lg bg-secondary-light hover:bg-secondary-dark duration-300 m-auto"
							>
								Sign Out
							</button>
						</div>
					)
				) : (
					<div className="flex flex-col justify-center items-center gap-4">
						<div>
							<h2 className="pb-1 text-center">Log in before continuing</h2>
							<h4 className="opacity-70 text-center">
								ensure you give permission to manage your youtube channel
							</h4>
						</div>
						<button
							type="button"
							onClick={() => signIn("google")}
							className="px-4 py-1 text-white rounded-lg bg-primary-light hover:bg-primary-dark duration-300 m-auto"
						>
							Sign In
						</button>
					</div>
				)}
			</div>
		</main>
	);
}
