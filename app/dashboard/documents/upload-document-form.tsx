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
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Id } from "@/convex/_generated/dataModel";
import { useOrganization } from "@clerk/nextjs";

const formSchema = z.object({
  title: z.string().min(2).max(80),
  file: z.instanceof(File),
});

export function UplaodDocumentForm({ onUpload }: { onUpload: () => void }) {
  const createDocument = useMutation(api.documents.createDocument);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const organization = useOrganization();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = await generateUploadUrl();

    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": values.file.type },
      body: values.file,
    });
    const { storageId } = await result.json();
    console.log(storageId);

    await createDocument({
      title: values.title,
      fileID: storageId as Id<"_storage">,
      orgId: organization.organization?.id,
    });
    // // sleep 2 seconds
    // // await new Promise((resolve) => setTimeout(resolve, 2000));
    onUpload();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Title</FormLabel>
              <FormControl>
                <Input placeholder="ABC by XYZ" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".txt, .xml, .doc, .docx, .md "
                  {...fieldProps}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    onChange(file);
                  }}
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
          Upload
        </LoadingButton>
      </form>
    </Form>
  );
}
