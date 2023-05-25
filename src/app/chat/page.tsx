"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import LinkChat from "src/components/LinkChat";

const Chat = () => {
  const { data: session } = useSession();
  const [userTwoIdValue, setUserTwoIdValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [chats, setChats] = useState([]);
  if (!session?.user) {
    redirect("/");
  }

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const res = await fetch("api/chats", {
      method: "POST",
      body: JSON.stringify({ userId: session.user.userData.userId }),
    });
    const data = await res.json();
    if (data) {
      setChats(data.chats);
    }
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
  const fetchMessages = async (chatId: string) => {
    const res = await fetch("api/fetchMessages", {
      method: "POST",
      body: JSON.stringify({
        chatId,
        userId: session.user.userData.userId,
      }),
    });
  };

  return (
    <>
      <main>
        <h1>Bubba</h1>
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
            <button onClick={() => fetchMessages("2")}> fetch messages </button>
          </section>
          <section>
            <h2>Chats</h2>
            {chats.map((chat) => (
              <LinkChat
                key={chat.chatId}
                chatId={chat.chatId}
                name={chat.name}
                imgUrl={chat.imgUrl}
              />
            ))}
          </section>
        </>
      </main>
    </>
  );
};

export default Chat;
