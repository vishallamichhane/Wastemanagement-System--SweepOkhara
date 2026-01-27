// import { betterAuth } from "better-auth";
// export const auth = betterAuth({
//   //...
// });
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:5173"
})

