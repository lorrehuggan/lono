import type { APIEvent } from "@solidjs/start/server";
import { setCookie } from "vinxi/http";
import { codeVerifier, spotify, state } from "~/lib/spotify";

export function GET(event: APIEvent) {
	const url = spotify.createAuthorizationURL(state, [
		// Users
		"user-read-email",
		"user-read-private",
		// Playlists
		"playlist-read-private",
		"playlist-read-collaborative",
		"playlist-modify-public",
		"playlist-modify-private",
		// Listening History
		"user-read-recently-played",
		"user-top-read",
		// Library
		"user-library-read",
		"user-library-modify",
		// Follow
		"user-follow-read",
		"user-follow-modify",
	]);

	setCookie("spotify_auth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7,
		sameSite: "lax",
	});

	setCookie("spotify_auth_code_verifier", codeVerifier, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7,
		sameSite: "lax",
	});

	event.response.headers.set("Location", url.toString());

	return new Response(null, {
		status: 302,
		headers: event.response.headers,
	});
}
