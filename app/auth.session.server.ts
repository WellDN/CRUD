import { GitHubStrategy } from "remix-auth-github";
import invariant from "tiny-invariant";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";

// export the whole sessionStorage object

export let authSessionStorage = sessionStorage

type User = string;

// you can also export the methods individually for your own usage
export let { getSession, commitSession, destroySession } = sessionStorage;

invariant(process.env.GITHUB_CLIENT_ID, "GITHUB_CLIENT_ID must be set");
invariant(process.env.GITHUB_CLIENT_SECRET, "GITHUB_CLIENT_SECRET must be set");
invariant(process.env.GITHUB_CALLBACK_URL, "GITHUB_CALLBACK_URL must be set");

let gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:
      process.env.NODE_ENV === "production"
        ? process.env.GITHUB_CALLBACK_URL
        : "http://localhost:3000/auth/github/callback",
  },
  async ({ accessToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    console.log("Find or create user:", { email: profile.emails[0].value });
    return profile.emails[0].value;
  }
);

export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(gitHubStrategy);

export function requireUserId(request: Request) {
  return authenticator.authenticate("github", request, {
    failureRedirect: "/login4",
  });
}
