"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDocumentButton } from "./delete-button";
export default function DocumentPage({
  params,
}: {
  params: { documentId: Id<"documents"> };
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });
  // if (!document) {
  //   return <div>You don't have access to view this document. </div>;
  // }

  return (
    <main className="pb-4 space-y-8">
      {!document ? (
        <div>
          <Skeleton className="w-[200px] h-[40px] rounded-md" />
          <div className=" flex gap-2 mt-10">
          <Skeleton className="w-[80px] h-[40px] rounded-md" />
          <Skeleton className="w-[80px] h-[40px] rounded-md" />
          </div>
          <Skeleton className="h-[500px] mt-6  rounded-md" />
        </div>
      ) : (
        <>
          <div className=" flex justify-between items-center">
            <h1 className="text-4xl font-bold p-0">{document.title}</h1>
            <DeleteDocumentButton documentId={document._id} />
          </div>
          <div className=" flex gap-12">
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="document">
                <div className="bg-gray-900 p-4 rounded-xl flex-1 h-[530px]">
                  {document.documentURL && (
                    <iframe
                      className="w-full h-full"
                      src={document.documentURL}
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="chat">
                {" "}
                <ChatPanel documentId={document._id} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </main>
  );
}
