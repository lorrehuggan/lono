import { action, redirect } from "@solidjs/router"
import { setCookie } from "vinxi/http"
import {
  invalidateSession,
  validateRequest,
} from "../authentication/contollers"

export const logout = action(async () => {
  "use server"

  console.log("Logging out user")

  // Validate the session token
  const { user, session } = await validateRequest()

  if (!session || !user) {
    throw redirect("/")
  }

  console.log("invalidating session")

  // Invalidate the session token
  await invalidateSession(session.id)
  // Clear the session token cookie
  setCookie("auth_session", "")
  setCookie("spotify_auth_code_verifier", "")
  setCookie("spotify_auth_state", "")
  setCookie("token", "")

  console.log("Logged out user")
  // Redirect to the login page
  throw redirect("/")
})
