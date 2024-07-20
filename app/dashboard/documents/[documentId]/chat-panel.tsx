"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useAction, useQuery } from "convex/react";
import { QuestionForm } from "./question-form";

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  // const askQuestion = useAction(api.documents.askQuestion);
  const chats = useQuery(api.chats.getChatsForDocument, {documentId})
  return (
    <div className="w-full dark:bg-gray-900 bg-slate-100 flex flex-col justify-between p-2 rounded-xl">
      <div className=" overflow-y-auto h-[430px] gap-2 space-y-2">

        {chats?.map(chat =>(
          <div key={chat._id} className={cn({
            "dark:bg-gray-950 bg-slate-300" : chat.isHuman === false,
            "dark:bg-slate-800 bg-slate-200" : chat.isHuman === true,
            "text-right": chat.isHuman,
            
          },"px-3 py-1 rounded-md whitespace-pre-line")}>{chat.isHuman ? "You: " : "AI: "}{chat.text}</div>
        
        ))}
        {/* <div className={cn({
             "bg-gray-300" : true
        },"bg-gray-950 px-3 py-1 rounded-md text-left")}>Ask something from ai about thus document.</div>
        <div className={cn({
             "bg-slate-800" : true,
        },"px-3 py-1 rounded-md text-right")}>Ask something from ai about thus document.</div> */}
      </div>
      <div>
        <QuestionForm  documentId={documentId}/>
        {/* <form
          className="flex gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const formData = new FormData(form);
            const text = formData.get("text") as string;

            await askQuestion({ documentId: documentId, question: text }).then(
              console.log
            );
          }}
        >
          <Input required name="text" />
          <Button>Submit</Button>
        </form> */}
      </div>
    </div>
  );
}
