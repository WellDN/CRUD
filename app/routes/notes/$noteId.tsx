import { Link, Outlet } from "@remix-run/react";

export default function NoteDetailsPage() {

  return (
  <div>
  <div className="flex justify-end">
    <Link to="edit"
    >
    📝 edit
    </Link>
    </div>
    <Outlet />
    </div>
  );
}
