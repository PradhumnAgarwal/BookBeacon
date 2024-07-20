"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { DeleteNoteButton } from "./delete-note-button";

export default function NotePage() {
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();
  const note = useQuery(api.notes.getNote, {
    noteId: noteId,
  });
  return <div className="relative pr-14 bg-slate-200 whitespace-pre-line h-[550px] overflow-y-scroll flex-1 dark:bg-slate-800 p-4 rounded-xl">
    <DeleteNoteButton noteId={noteId} />
    {note?.text}
    </div>;
}
