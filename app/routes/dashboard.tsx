import { useLoaderData, Form } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node"
import { authenticator } from "~/auth.server";

export let loader = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  return { user };
};

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();


  return (
    <div>
      <h1>Welcome
      {user.displayName}!
      </h1>
      <p>This is a protected page</p>
      <Form action="/logout" method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
};
