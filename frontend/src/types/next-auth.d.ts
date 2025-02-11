import type DefaultSession from "next-auth";

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			/** Oauth access token */
			token?: accessToken;
			image?: string;
			name?: string;
		};
		access_token: token.access_token;
		refresh_token: token.refresh_token;
		expires_at: token.expires_at;
		scope: token.scope & DefaultSession["user"];
	}
}
