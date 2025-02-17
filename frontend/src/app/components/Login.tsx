"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Login() {
	const { data: session } = useSession();

	if (session) {
		return (
			<button
				type="button"
				onClick={() => signOut()}
				className="flex gap-3 pl-1"
			>
				<div className="px-3 py-1 text-white rounded-lg bg-secondary-light hover:bg-secondary-dark duration-300 m-auto">
					Sign Out
				</div>
				<div className="flex flex-col justify-center items-center">
					<div className="w-12 h-12 relative flex items-center justify-center rounded-full overflow-clip hover:border-2 border-dark dark:border-light">
						<div className="absolute w-full h-full flex items-center justify-center">
							<svg
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								className="size-6 stroke-dark dark:stroke-light"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
								/>
							</svg>
						</div>
						<Image
							src={session.user?.image ?? ""}
							alt="PFP"
							width="48"
							height="48"
							className="rounded-3xl absolute opacity-100 hover:opacity-0 duration-300"
						/>
					</div>

					<p className="absolute mt-[72px] text-center">{session.user?.name}</p>
				</div>
			</button>
		);
	}
}
