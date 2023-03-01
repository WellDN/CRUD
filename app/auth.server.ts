// app/server/auth.server.ts
import { Authenticator } from "remix-auth";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { sessionStorage } from "./session.server";
import { prisma } from "./db.server";
import type { User } from "@prisma/client";

// Create an instance of the authenticator
export let authenticator = new Authenticator<User>(sessionStorage, { sessionKey: '_session' });
// You may specify a <User> type which the strategies will return (this will be stored in the session)
// export let authenticator = new Authenticator<User>(sessionStorage, { sessionKey: '_session' });

const getCallback = (provider: SocialsProvider) => {
  return `http://localhost:3000/auth/${provider}/callback`
} 

authenticator.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: getCallback(SocialsProvider.GOOGLE)
  },
  async ({ profile }) => {
    // here you would find or create a user in your database
    const user = await prisma.user.upsert({
         where: {
           email: profile.emails![0].value,
         },
         update: {
           googleId: profile.id,
         },
         create: {
           email: profile.emails![0].value,
           googleId: profile.id,
         },
       });
       return user;
     }
   ));
