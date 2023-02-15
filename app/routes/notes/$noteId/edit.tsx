import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { redirect, json } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import React from "react";
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
    
    return redirect(`/notes/${params.id}`)
}

export default function EditNotes() {
    const data = useLoaderData<typeof loader>();

    const actionData = useActionData<typeof action>();
    const titleRef = React.useRef<HTMLInputElement>(null);
    const bodyRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
            if (actionData?.errors?.title) {
            titleRef.current?.focus();
            } else if (actionData?.errors?.body) {
            bodyRef.current?.focus();
            }
            }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>
          Title:
          </span>
          <input
            defaultValue={data.note.title}
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>
          Body: 
          </span>
          <textarea
            defaultValue={data.note.body}
            ref={bodyRef}
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? "body-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.body && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.body}
          </div>
        )}
      </div>
      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
      </Form>
  )
}
