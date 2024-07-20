"use client";
import { Button } from "@/components/ui/button";
// import { api } from "@/convex/_generated/api";
// import { useMutation } from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UplaodDocumentForm } from "./upload-document-form";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function UploadDocumentButton() {
    const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button className="flex it gap-2"><Upload className="w-4 h-4" />Upload Document</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uplaod a document</DialogTitle>
            <DialogDescription>
              This document will be added to your documents. You can access them
              later or can search over them directly.
            </DialogDescription>
            <UplaodDocumentForm onUpload ={() =>setIsOpen(false)} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
