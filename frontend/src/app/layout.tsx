import "./globals.css";
import { Inter } from "next/font/google";
import Theme from "./components/Theme";
import Footer from "./components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
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
				<AuthProvider session={session}>
					<div className="bg-light text-dark dark:bg-dark dark:text-light min-h-screen flex flex-col">
						<Theme />
						<div className="flex flex-grow justify-center">{children}</div>
						<Footer />
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
