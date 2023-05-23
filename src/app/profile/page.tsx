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
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="flex flex-col gap-3">
        <p className="text-lg">Name: {session?.user?.name}</p>
        <p className="text-lg">Email: {session?.user?.email}</p>
        <Image
          src={session?.user?.image ?? ""}
          alt="Profile Image"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};

export default Profile;
