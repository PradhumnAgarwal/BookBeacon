import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import { HeaderActions } from "./header-actions";

export function Header() {
  return (
    <div className=" bg-slate-900 py-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="logo" width={40} height={30} />
          <span
            className=" text-2xl font-semibold"
            style={{ color: "#f27d09" }}
          >
            TopicTrack
          </span>
        </div>
        <div className=" flex justify-between items-center gap-6">
          <ModeToggle />
          <HeaderActions />
         
        </div>
      </div>
    </div>
  );
}
