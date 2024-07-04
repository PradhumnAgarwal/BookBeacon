"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DocumentCard } from "./document-card";
import UploadDocumentButton from "./upload-document-button";

export default function Home() {
  const document = useQuery(api.documents.getDocument);

  return (
    <main className=" p-16 space-y-8">
      <div className=" flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Documents</h1>
        <UploadDocumentButton />
      </div>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
        {document?.map((doc) => <DocumentCard key={doc._id} document={doc} />)}
      </div>
    </main>
  );
}
