"use client";

import { api } from "@/convex/_generated/api";
import CreateNoteButton from "./create-note-button";
import { query } from "@/convex/_generated/server";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function NotesPage() {

  return (
   <div className="text-2xl text-ce">Please select a note</div>
  );
}
