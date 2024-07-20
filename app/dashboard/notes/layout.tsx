"use client";

import { api } from "@/convex/_generated/api";
import CreateNoteButton from "./create-note-button";
import { query } from "@/convex/_generated/server";
import { useQuery } from "convex/react";
import Link from "next/link";
import { ReactHTMLElement, ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";

export default function NotesLayout({ children }: { children: ReactNode }) {
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();
  const organization = useOrganization()
  const notes = useQuery(api.notes.getNotes, {
    orgId: organization.organization?.id
  });
  return (
    <main className="space-y-8 w-full">
      <div className=" flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Notes</h1>
        <CreateNoteButton />
      </div>

      {!notes && (
        <div className="flex gap-12">
          <div className="w-[200px] space-y-4">
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-[60px] w-full" />
          </div>

          <div className="flex-1">
            <Skeleton className="h-[438px] w-full" />
          </div>
        </div>
      )}
      {notes?.length === 0 && (
        <div>
          <div className="flex flex-col items-center justify-center gap-6">
            <Image src="/docs.svg" alt="" width={500} height={500} />
            <h2 className="text-2xl font-semibold">No Notes to show!</h2>
          </div>
        </div>
      )}

      {notes && notes.length > 0 && (
        <div className="flex gap-6">
          <ul className="space-y-2 min-w-[200px]">
            {notes?.map((note) => (
              <li
                key={note._id}
                className={cn(
                  "border-2 border-gray-200 p-4 rounded-xl hover:text-orange-300",
                  {
                    "text-orange-300": note._id === noteId,
                  }
                )}
              >
                <Link href={`/dashboard/notes/${note._id}`}>
                  <p>
                    {note.text.length > 21
                      ? note.text.substring(0, 18) + "..."
                      : note.text}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="w-full">{children}</div>
        </div>
      )}
    </main>
  );
}
