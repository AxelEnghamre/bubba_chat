"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

const Chat = () => {
  const { data: session } = useSession();
  const [userTwoIdValue, setUserTwoIdValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
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
  const createChat = async (userTwoId: string) => {
    const res = await fetch("api/createChat", {
      method: "POST",
      body: JSON.stringify({
        userOne: session.user.userData.userId,
        userTwo: userTwoId,
      }),
    });
  };
  const sendMessage = async (chatId: string, message: string) => {
    const res = await fetch("api/sendMessage", {
      method: "POST",
      body: JSON.stringify({
        chatId,
        message,
        userId: session.user.userData.userId,
      }),
    });
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
              <input
                className="text-black"
                type="text"
                onChange={(e) => setUserTwoIdValue(e.target.value)}
                value={userTwoIdValue}
              />
              <button onClick={() => createChat(userTwoIdValue)}>
                {" "}
                Create Chat{" "}
              </button>
              <input
                className="text-black"
                type="text"
                onChange={(e) => setMessageValue(e.target.value)}
                value={messageValue}
              />
              <button onClick={() => sendMessage("2", messageValue)}>
                {" "}
                Send Message{" "}
              </button>
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
