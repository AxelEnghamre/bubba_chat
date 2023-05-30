"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
const Navigation = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <nav className="absolute inset-0 left-1/2 flex h-12 w-fit -translate-x-1/2 transform flex-col items-center justify-center rounded-b-3xl bg-zinc-700 p-3 text-white">
      <div className="flex gap-3">
        <Link href="/">Home</Link>
        {session?.user ? (
          <>
            <button onClick={() => signOut()}>Logout</button>
            <Link href="/chat">Chat</Link>
            <Link href="/profile">Profile</Link>
          </>
        ) : (
          <>
            <button onClick={() => signIn()}>Login</button>
            <Link href="/about">About</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
