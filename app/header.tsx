import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import { HeaderActions } from "./header-actions";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";

export function Header() {
  return (
    <div className=" dark:bg-slate-900 bg-slate-200 z-10 relative py-4">
      <div className="container flex justify-between items-center">
        <div>
          <Link href={"/dashboard"} className="flex items-center gap-4">
            <Image src="/logo.png" alt="logo" width={40} height={30} />
            <span
              className=" text-2xl font-semibold"
              style={{ color: "#f27d09" }}
            >
              BookBeacon
            </span>
          </Link>
        </div>
        <div className=" flex justify-between items-center gap-6">
          <Link href={"/"} className="flex items-center gap-4">
            <span className=" text-md font-semibold">Home</span>
          </Link>
          <OrganizationSwitcher />
          <ModeToggle />
          <HeaderActions />
        </div>
      </div>
    </div>
  );
}
