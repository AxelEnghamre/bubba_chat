"use client";
import LinkChat from "@/components/LinkChat";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
type Chat = {
  id: string;
  image: string;
  chatId: string;
  name: string;
  otherUserName: string;
};
const Chat = () => {
  const { data: session } = useSession();
  const [userTwoIdValue, setUserTwoIdValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);

  if (!session?.user) {
    redirect("/");
  }

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchUser = async (userId: string) => {
    const res = await fetch("api/fetchUser", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data) {
      console.log(data);
    }
    return data;
  };

  const fetchChats = async () => {
    const res = await fetch("api/chats", {
      method: "POST",
      body: JSON.stringify({ userId: session.user.userData.userId }),
    });
    const data = await res.json();
    if (data) {
      const filteredChats = data.chats.filter(
        (chat) =>
          chat.user_one === session.user.userData.userId ||
          chat.user_two === session.user.userData.userId
      );
      const chatsWithUserData = await Promise.all(
        filteredChats.map(async (chat) => {
          const otherUserId =
            chat.user_one === session.user.userData.userId
              ? chat.user_two
              : chat.user_one;
          console.log("otherUserId");
          console.log(otherUserId);
          const otherUser = await fetchUser(otherUserId);
          console.log("otherUser");
          console.log(otherUser.name);
          return {
            ...chat,
            otherUserName: otherUser[0]?.name ?? "Unknown User",
          };
        })
      );
      setChats(chatsWithUserData);
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
            <div key={crypto.randomUUID()}>
              {chats.map((chat) => {
                console.log("chat");
                console.log(chat);
                return (
                  <LinkChat
                    key={crypto.randomUUID()}
                    chatId={chat.id}
                    name={chat.otherUserName}
                    imgUrl={chat.image}
                  />
                );
              })}
            </div>
          </section>
        </>
      </main>
    </>
  );
};

export default Chat;
