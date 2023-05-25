"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Chat = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/");
  }

  const fetchChats = async () => {
    const res = await fetch("api/chats", {
      method: "POST",
      body: JSON.stringify({ userId: session.user.userData.userId }),
    });
    const data = await res.json();

    console.log(data);
  };

  return (
    <>
      <main>
        <h1>Bubba</h1>

        {session?.user ? (
          <>
            <h2>{`Welcome ${session.user.name}`}</h2>
            <section className="mt-96">
              <h2>Contacts</h2>
              <button onClick={fetchChats}>fetch chats</button>
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
