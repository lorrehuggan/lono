import { db } from "~/lib/db/init";
import type { APIEvent } from "@solidjs/start/server";
import { OAuth2RequestError } from "arctic";
import { spotify } from "~/lib/spotify";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "~/lib/authentication/contollers";
import { SpotifyUser } from "~/types";
import { userTable } from "~/lib/db/schema/user";
import { eq } from "drizzle-orm";
import { getCookie } from "vinxi/http";

export async function GET(event: APIEvent) {
  const url = new URL(event.request.url);

  const code = url.searchParams.get("code");
  const storedState = getCookie(event.nativeEvent, "spotify_auth_state");
  const codeVerifierCookie = getCookie(
    event.nativeEvent,
    "spotify_auth_code_verifier",
  );

  if (!code || !storedState || !codeVerifierCookie) {
    return new Response("Invalid request", { status: 400 });
  }

  try {
    const tokens = await spotify.validateAuthorizationCode(code);
    const sessionId = generateSessionToken();
    const spotifyUserResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    });
    const spotifyUser =
      (await spotifyUserResponse.json()) as unknown as SpotifyUser;

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, spotifyUser.id))
      .get();

    if (existingUser) {
      const session = await createSession(sessionId, existingUser.id);
      setSessionTokenCookie(sessionId, session.expiresAt);

      return new Response("Logged in", {
        status: 302,
        headers: {
          Location: "/home",
        },
      });
    }

    const userData = {
      id: spotifyUser.id,
      name: spotifyUser.display_name,
      email: spotifyUser.email,
    };

    await db.insert(userTable).values(userData);

    const session = await createSession(sessionId, userData.id);

    setSessionTokenCookie(sessionId, session.expiresAt);

    return new Response("Logged in", {
      status: 302,
      headers: {
        Location: "/home",
      },
    });
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      return new Response("Invalid request", { status: 400 });
    }
    return new Response("Oops internal Server Error", { status: 500 });
  }
}
