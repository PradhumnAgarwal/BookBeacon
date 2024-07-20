"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DocumentCard } from "./document-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import UploadDocumentButton from "./upload-document-button";
import { useOrganization } from "@clerk/nextjs";

export default function Home() {
  const organization = useOrganization()
  const document = useQuery(api.documents.getDocuments, {
    ordId : organization.organization?.id
  });

  return (
    <main className="space-y-8">
      <div className=" flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Documents</h1>
        <UploadDocumentButton />
      </div>
      {!document ? (
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {" "}
                <Skeleton className="w-[100px] h-[20px] rounded-md" />
              </CardTitle>
              <CardDescription>
                {" "}
                <Skeleton className=" h-[20px] rounded-md" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[60px] rounded-md" />
            </CardContent>
            <CardFooter>
              <Skeleton className="w-[100px] h-[20px] rounded-md" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {" "}
                <Skeleton className="w-[100px] h-[20px] rounded-md" />
              </CardTitle>
              <CardDescription>
                {" "}
                <Skeleton className=" h-[20px] rounded-md" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[60px] rounded-md" />
            </CardContent>
            <CardFooter>
              <Skeleton className="w-[100px] h-[20px] rounded-md" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {" "}
                <Skeleton className="w-[100px] h-[20px] rounded-md" />
              </CardTitle>
              <CardDescription>
                {" "}
                <Skeleton className=" h-[20px] rounded-md" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[60px] rounded-md" />
            </CardContent>
            <CardFooter>
              <Skeleton className="w-[100px] h-[20px] rounded-md" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {" "}
                <Skeleton className="w-[100px] h-[20px] rounded-md" />
              </CardTitle>
              <CardDescription>
                {" "}
                <Skeleton className=" h-[20px] rounded-md" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[60px] rounded-md" />
            </CardContent>
            <CardFooter>
              <Skeleton className="w-[100px] h-[20px] rounded-md" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {" "}
                <Skeleton className="w-[100px] h-[20px] rounded-md" />
              </CardTitle>
              <CardDescription>
                {" "}
                <Skeleton className=" h-[20px] rounded-md" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[60px] rounded-md" />
            </CardContent>
            <CardFooter>
              <Skeleton className="w-[100px] h-[20px] rounded-md" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {" "}
                <Skeleton className="w-[100px] h-[20px] rounded-md" />
              </CardTitle>
              <CardDescription>
                {" "}
                <Skeleton className=" h-[20px] rounded-md" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[60px] rounded-md" />
            </CardContent>
            <CardFooter>
              <Skeleton className="w-[100px] h-[20px] rounded-md" />
            </CardFooter>
          </Card>
        </div>
      ) : (
        <>
          {(document && document.length === 0 )? (
            <div className="flex flex-col items-center justify-center gap-6">
              <Image src="/docs.svg" alt="" width={500} height={500} />
              <h2 className="text-2xl font-semibold">No documents to show!</h2>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
              {document?.map((doc) => (
                <DocumentCard key={doc._id} document={doc} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
