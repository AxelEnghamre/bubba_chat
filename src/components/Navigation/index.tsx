"use client";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Navigation = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <nav className=" fixed inset-0 w-screen h-24 flex gap-3 bg-slate-400 text-white justify-center items-center">
      <Link href="/"> Home </Link>
      {session?.user ? (
        <>
          <button onClick={() => signOut()}>Logout</button>
          <Link href="/contacts"> Contacts </Link>
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
