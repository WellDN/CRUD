// app/server/auth.server.ts
import { Authenticator } from "remix-auth";
import { GoogleStrategy, FacebookStrategy, SocialsProvider,  GitHubStrategy } from "remix-auth-socials";
import { sessionStorage } from "./session.server";
import type { GoogleProfile } from "remix-auth-socials";

// Create an instance of the authenticator
export let authenticator = new Authenticator(sessionStorage, { sessionKey: '_session' });
// You may specify a <User> type which the strategies will return (this will be stored in the session)
// export let authenticator = new Authenticator<User>(sessionStorage, { sessionKey: '_session' });

const getCallback = (provider: SocialsProvider) => {
  return `http://localhost:3000/api/sessions/oauth/${provider}`
} 

authenticator.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: getCallback(SocialsProvider.GOOGLE)
  },
  async ({ profile, accessToken, refreshToken, extraParams, ...rest }) => {
    // here you would find or create a user in your database
      return profile as GoogleProfile; 
  }
));

authenticator.use(new FacebookStrategy(
  {
    clientID: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    callbackURL: getCallback(SocialsProvider.FACEBOOK)
  },
  async ({ profile }) => {}
));

authenticator.use(new GitHubStrategy(
  {
    clientID: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    callbackURL: getCallback(SocialsProvider.GITHUB)
  },
  async ({ profile }) => {}
));

