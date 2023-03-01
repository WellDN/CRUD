import type { MetaFunction, LoaderArgs, ActionArgs } from "@remix-run/node";
import { redirect } from "react-router";
import { authenticator } from "~/auth.server";

export async function loader({ request }: LoaderArgs) {
     const user = await authenticator.isAuthenticated(request);
     if (user) return redirect("/notes");
     return null;
   }
  
   export const action = ({ request, params }: ActionArgs) => {
     const { provider } = params;
     if (!provider) return { error: { status: 400, message: "This provider is not supported"}}
     return authenticator.authenticate(provider, request);
   };
  
   export const meta: MetaFunction = () => {
     return {
       title: "Login",
     };
   };

