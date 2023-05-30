"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navigation = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <nav className=" fixed inset-0 flex h-fit w-screen items-center justify-center gap-3 bg-slate-400 text-white">
      <Link href="/"> Home </Link>
      {session?.user ? (
        <>
          <button onClick={() => signOut()}>Logout</button>
          <Link href="/chat"> Chat </Link>
          <Link href="/profile"> Profile </Link>
        </>
      ) : (
        <>
          <button onClick={() => signIn()}>Login</button>
          <Link href="/about"> About </Link>
        </>
      )}
    </nav>
  );
};

export default Navigation;
