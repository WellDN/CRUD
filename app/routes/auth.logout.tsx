import type { ActionArgs } from "@remix-run/node"
import { authenticator } from "~/auth.server";

export let action = async ({ request, params }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: "/" });
};
