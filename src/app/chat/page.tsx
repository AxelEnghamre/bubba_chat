"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Chat = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/");
  }
  return (
    <>
      <main>
        <h1>Bubba</h1>

        {session?.user ? (
          <>
            <h2>{`Welcome ${session.user.name}`}</h2>
            <section>
              <h2>Contacts</h2>
            </section>
          </>
        ) : (
          <p>Bubba Chat is a nice chat application</p>
        )}
      </main>
    </>
  );
};

export default Chat;
