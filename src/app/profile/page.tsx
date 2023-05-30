"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";

const Profile = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center gap-3 bg-zinc-900">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="flex flex-col items-center gap-3 rounded-lg bg-zinc-700 p-3 px-10 py-10 text-white shadow-md transition-shadow hover:shadow-lg">
          <p className="text-lg">Name: {session?.user?.name}</p>
          <p className="text-lg">Email: {session?.user?.email}</p>
          <Image
            src={session?.user?.image ?? ""}
            alt="Profile Image"
            width={200}
            height={200}
          />
        </div>
      </main>
    </>
  );
};

export default Profile;
