"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export interface AuthProviderProps {
	children: React.ReactNode;
	session?: Session | null;
}

function AuthProvider({ children, session }: Readonly<AuthProviderProps>) {
	return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default AuthProvider;
