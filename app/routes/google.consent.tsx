/*  this should be the auth consent screen showing the user logged but you can't use 2 loaders in the same component
 *
import type { User } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";

export async function loader ({ request }: LoaderArgs) {
  const iuser = await authenticator.isAuthenticated(request, {
       failureRedirect: "/login",
     });
  
     return { iuser };
}

export default function GoogleConsent() {
    const { iuser } = useLoaderData() as unknown as { iuser: User }
    return(
    <p>{iuser.email}</p>
    )
}

*/
