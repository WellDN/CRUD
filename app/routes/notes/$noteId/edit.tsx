import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { redirect, json } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant";
import { editNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server"

export async function loader({ request, params }: LoaderArgs) {
    const userId = await requireUserId(request);
    invariant(params.noteId, "noteId not found");

    const note = await getNote({ userId, id: params.noteId });
    if (!note) {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ note });
}

export async function action({ request, params }: ActionArgs) {
    const formData = await request.formData();
    const title = formData.get("title")
    const body = formData.get("body")
    const userId = await requireUserId(request);
    invariant(params.noteId, "noteId not found");

if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", body: null } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { body: "Body is required", title: null } },
      { status: 400 }
    );
  }

    await editNote({ userId, id: params.noteId, body, title });
    
    return redirect(`/notes/`)
}

export default function EditNotes() {
    const data = useLoaderData<typeof loader>();
    
    return(
        (
    <div className="">
    <div className="justify-end flex">
    <Link to="./edit"
    >
    📝 edit
    </Link>
    </div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
        Save
        </button>
      </Form>
    </div>
  )
    )
}
