import { sha256 } from "@oslojs/crypto/sha2";
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { getRequestEvent } from "solid-js/web";
import { getCookie, setCookie } from "vinxi/http";
import { db } from "~/lib/db/init";
import type { Session, User } from "~/types";
import { sessionTable, userTable } from "../db/schema/user";

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export function encodeToken(token: string): string {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function createSession(
	token: string,
	userId: string,
	tokens: { accessToken: string; refreshToken: string },
): Promise<Session> {
	const sessionId = encodeToken(token);
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		accessToken: tokens.accessToken,
		refreshToken: tokens.refreshToken,
	};
	await db.insert(sessionTable).values(session);
	return session;
}

export async function validateSessionToken(
	token: string,
): Promise<SessionValidationResult> {
	const sessionId = encodeToken(token);

	const result = await db
		.select({ user: userTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.id, sessionId));

	if (result.length < 1) {
		return { session: null, user: null };
	}
	const { user, session } = result[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessionTable)
			.set({
				expiresAt: session.expiresAt,
			})
			.where(eq(sessionTable.id, session.id));
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function validateRequest() {
	"use server";
	const event = getRequestEvent()!;
	const sessionId = getCookie(event?.nativeEvent, "auth_session");
	if (!sessionId) {
		return {
			user: null,
			session: null,
		};
	}
	const { session, user } = await validateSessionToken(sessionId);

	if (!session) {
		return {
			user: null,
			session: null,
		};
	}

	return {
		user,
		session,
	};
}

export async function setSessionTokenCookie(
	token: string,
	expiresAt: Date,
): Promise<void> {
	setCookie("auth_session", token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		expires: expiresAt,
		path: "/",
	});
}

export async function deleteSessionTokenCookie(): Promise<void> {
	setCookie("auth_session", "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		expires: new Date(0),
		maxAge: 0,
		path: "/",
	});
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
