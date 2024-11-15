import { query } from "@solidjs/router"
import { validateRequest } from "../authentication/contollers"

export const getUser = query(async () => {
  "use server"
  console.log("Getting user")
  const { user } = await validateRequest()
  console.log("Got user", user)

  return user
}, "user")
