import "./globals.css";
import { Inter } from "next/font/google";
import Theme from "./components/Theme";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import AuthProvider from "./components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Spotify to Youtube Music",
	description:
		"Convert Spotify playlists to Youtube Musics playlists automatically",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);

	return (
		<html lang="en" className="dark">
			<body className={inter.className}>
				<div className="bg-light text-dark dark:bg-dark dark:text-light">
					<AuthProvider session={session}>
						<Theme />
						{children}
					</AuthProvider>
				</div>
			</body>
		</html>
	);
}
