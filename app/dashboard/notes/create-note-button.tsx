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
import { CreateNoteForm } from "./create-note-form";
import { useState } from "react";
import { ClipboardPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CreateNoteButton() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button className="flex it gap-2">
            <ClipboardPlus className="w-4 h-4" />
            Create Note
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Note</DialogTitle>
            <DialogDescription>Add a note to help you later!</DialogDescription>
            <CreateNoteForm
              onUpload={() => {
                setIsOpen(false);
                toast({
                  title: "Note Created",
                });
              }}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
