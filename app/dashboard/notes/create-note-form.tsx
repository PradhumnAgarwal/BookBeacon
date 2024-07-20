"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { useOrganization } from "@clerk/nextjs";

const formSchema = z.object({
  text: z.string().min(5),
});

export function CreateNoteForm({ onUpload }: { onUpload: () => void }) {
  const createNote = useMutation(api.notes.createNote);
  const organization = useOrganization();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createNote({
      text: values.text,
      orgId: organization.organization?.id,
    });
    onUpload();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Note</FormLabel> */}
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Start typing here..."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loadingText="Uploading..."
          isLoading={form.formState.isSubmitting}
        >
          Create
        </LoadingButton>
      </form>
    </Form>
  );
}
