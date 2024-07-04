"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import Image from "next/image";

export function HeaderActions() {
  return (
    <>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
          <UserButton />
      </Authenticated>
      <AuthLoading>
        {/* <p>Loading...</p> */}
        <Image src='/user.jpg' alt="user" width={40} height={40} className=" rounded-full" />
      </AuthLoading>
    </>
  );
}
