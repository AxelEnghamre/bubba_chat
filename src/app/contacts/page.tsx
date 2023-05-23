"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Contacts = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <>
      <h1>Contacts</h1>
    </>
  );
};

export default Contacts;
