"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";

const formSchema = z.object({
  search: z.string().min(2),
});
export function SearchForm({
  setRecords,
}: {
  setRecords: (
    notes: typeof api.search.searchAction._returnType | null
  ) => void;
}) {
  const searchAction = useAction(api.search.searchAction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await searchAction({ search: values.search }).then(setRecords);
    // form.reset();
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex gap-2"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="flex flex-col flex-1">
              {/* <FormLabel>Document Title</FormLabel> */}
              <FormControl>
                <Input placeholder="Type your query here!" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loadingText="Searching..."
          isLoading={form.formState.isSubmitting}
        >
          Search
        </LoadingButton>
      </form>
    </Form>
  );
}
