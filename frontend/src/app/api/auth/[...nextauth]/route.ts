import NextAuth from "next-auth";
import type { Account, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
			authorization: {
				params: {
					scope:
						"openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube",
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,

	callbacks: {
		async jwt({ token, account }: { token: JWT; account: Account | null }) {
			if (account) {
				token = Object.assign({}, token, {
					access_token: account.access_token,
					refresh_token: account.refresh_token,
					expires_at: account.expires_at,
					scope: account.scope,
				});
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			if (session) {
				session = Object.assign({}, session, {
					access_token: token.access_token,
					refresh_token: token.refresh_token,
					expires_at: token.expires_at,
					scope: token.scope,
				});
				console.log(session);
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
