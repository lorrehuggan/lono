import { Spotify, generateCodeVerifier, generateState } from "arctic";

export const spotify = new Spotify(
  process.env.SPOTIFY_CLIENT_ID ?? "",
  process.env.SPOTIFY_CLIENT_SECRET ?? "",
  process.env.REDIRECT_URI ?? "",
);

export const state = generateState();
export const codeVerifier = generateCodeVerifier();
