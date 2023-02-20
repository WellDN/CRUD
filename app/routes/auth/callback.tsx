// app/routes/auth/github/callback.tsx
import type { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/auth.session.server";

export let loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate("github", request, {
    successRedirect: "/private",
    failureRedirect: "/login",
  });
};
