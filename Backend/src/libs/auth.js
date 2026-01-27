import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";


const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
const db = client.db();

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  trustedOrigins: ["http://localhost:5173"],
  appUrl: "http://localhost:5173",
  user: {
    additionalFields: {
      phone: { type: 'string' },
      address: { type: 'string' },
      ward: { type: 'string' },
      role: { type: 'string', default: 'user' },
    }
  },
  emailAndPassword: { 
    enabled: true, 
  },

  // socialProviders: { 
  //   google: { 
  //     clientId: process.env.GOOGLE_CLIENT_ID , 
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET , 
  //   }, 
  // }, 


  

    //   emailVerification: {
    //     sendVerificationEmail: async ({ user, url, token }, request) => {
    //         void sendEmail({
    //             to: user.email,
    //             subject: 'Verify your email address',
    //             text: `Click the link to verify your email: ${url}`
    //         })
    //     },

    //     sendOnSignUp: true
    // },
    database: mongodbAdapter(db, {client}),
});


// const data = await auth.api.signUpEmail({
//     body: {
//         name: "John Doe", // required
//         email: "john.doe@example.com", // required
//         password: "password1234", // required
//         image: "https://example.com/image.png",
//         callbackURL: "https://example.com/callback",
//     },
// });