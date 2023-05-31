"use client";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
const Navigation = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <nav className="absolute inset-0 left-1/2 flex h-14 w-fit -translate-x-1/2 transform flex-col items-center justify-center rounded-b-3xl bg-zinc-700 p-3 text-white">
      <motion.div className="flex gap-3">
        <Link
          className="rounded-md px-3 py-2 text-sm font-medium text-white duration-100 hover:bg-rose-700"
          href="/"
        >
          Home
        </Link>
        {session?.user ? (
          <>
            <button
              className="rounded-md px-3 py-2 text-sm font-medium text-white duration-100 hover:bg-rose-700 "
              onClick={() => signOut()}
            >
              Logout
            </button>
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-white duration-100 hover:bg-rose-700 "
              href="/chat"
            >
              Chat
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-white duration-100 hover:bg-rose-700 "
              href="/profile"
            >
              Profile
            </Link>
          </>
        ) : (
          <>
            <button
              className="rounded-md px-3 py-2 text-sm font-medium text-white duration-100 hover:bg-rose-700 "
              onClick={() => signIn()}
            >
              Login
            </button>
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-white duration-100 hover:bg-rose-700 "
              href="/about"
            >
              About
            </Link>
          </>
        )}
      </motion.div>
    </nav>
  );
};

export default Navigation;
