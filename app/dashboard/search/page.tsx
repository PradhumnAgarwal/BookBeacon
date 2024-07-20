"use client";

import { useEffect, useState } from "react";
import { SearchForm } from "./search-form";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Clipboard, File } from "lucide-react";

function SearchResult({
  url,
  score,
  text,
  type,
}: {
  url: string;
  score: number;
  text: string;
  type: string;
}) {
  return (
    <Link href={url}>
      <li className="dark:hover:bg-slate-800 dark:bg-slate-900 bg-slate-200 hover:bg-slate-300 p-4 rounded-md whitespace-pre-line">
        <div className="w-full flex justify-between pb-4 pr-6">
          {type === "note" ? (
            <span className=" flex gap-2 items-center">
              <Clipboard className="w-4 h-4" /> Note
            </span>
          ) : (
            <span className=" flex gap-2 items-center">
              <File className="w-4 h-4" /> Document
            </span>
          )}
          {"Relevency: " + score.toPrecision(2)}
        </div>
        <p>{text.substring(0, 500)}</p>
      </li>
    </Link>
  );
}

export default function Search() {
  const [records, setRecords] = useState<
    typeof api.search.searchAction._returnType | null
  >(null);

  useEffect(() => {
    const storedResults = sessionStorage.getItem("searchResults");
    if (!storedResults) return;
    setRecords(JSON.parse(storedResults));
  }, []);
  return (
    <main className="space-y-8 pb-4">
      <div className=" flex justify-between items-center">
        <h1 className="text-4xl font-bold">Search</h1>
      </div>
      <SearchForm
        setRecords={(searchResults) => {
          setRecords(searchResults);
          sessionStorage.setItem("searchResults", JSON.stringify(searchResults));
        }}
      />
      <ul className="flex flex-col gap-4">
        {records?.map((record) => {
          if (record.type === "notes") {
            return (
              <SearchResult
              key={record.score}
                type="note"
                url={`/dashboard/notes/${record.record._id}`}
                score={record.score}
                text={record.record.text}
              />
            );
          } else {
            return (
              <SearchResult
              key={record.score}
                type="document"
                url={`/dashboard/documents/${record.record._id}`}
                score={record.score}
                text={record.record.title + ": " + record.record.description}
              />
            );
          }
        })}
      </ul>
    </main>
  );
}
