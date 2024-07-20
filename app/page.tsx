import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-slate-200 dark:bg-slate-950 min-h-[calc(100vh-72px)]">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-0 pt-20">
          <div className="text-center">
            <Image
              src="/logo.png"
              width="200"
              height="200"
              alt=""
              className="mx-auto rounded-2xl mb-4"
            />
            <h1 className="dark:text-gray-50 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Book Beacon
            </h1>
            <p className="dark:text-gray-100 mt-6 text-lg leading-8 text-gray-600 mb-6">
              Book beacon helps in storing all the documents and notes for you
              and your team and allow easy vector search and RAG using Google
              Gemini.
            </p>
            <div className="mt-14">
              <Link href="/dashboard" >
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(60%-18rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(60%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
