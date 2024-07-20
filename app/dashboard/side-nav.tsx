"use client";

import { cn } from "@/lib/utils";
import { Clipboard, Files, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();
  return (
    <nav className="">
      <ul className=" space-y-10">
        <li>
          <Link
            className={cn(
              "text-xl flex gap-1 items-center hover:text-orange-400",
              { "text-orange-400": pathname.endsWith("/dashboard/documents") }
            )}
            href="/dashboard/documents"
          >
            <Files className="h-5 w-5" />
            Documents
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              "text-xl flex gap-1 items-center hover:text-orange-400",
              { "text-orange-400": pathname.endsWith("/dashboard/notes") }
            )}
            href="/dashboard/notes"
          >
            <Clipboard className="h-5 w-5" />
            Notes
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              "text-xl flex gap-1 items-center hover:text-orange-400",
              { "text-orange-400": pathname.endsWith("/dashboard/search") }
            )}
            href="/dashboard/search"
          >
            <Search className="h-5 w-5" />
            Search
          </Link>
        </li>
      </ul>
    </nav>
  );
}
