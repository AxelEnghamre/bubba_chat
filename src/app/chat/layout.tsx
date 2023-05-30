"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

type ChatUser = {
  image_url: string | null;
  name: string | null;
};

type Chat = {
  created_at: string;
  id: number;
  user_one: string;
  user_two: string;
  user_data_one?: ChatUser;
  user_data_two?: ChatUser;
};

const LinkChat = ({
  chatId,
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  currentUserId,
}: {
  chatId: string;
  userOne?: ChatUser;
  userOneId: string;
  userTwo?: ChatUser;
  userTwoId: string;
  currentUserId: string;
}) => {
  return (
    <Link href={`chat/${chatId}`}>
      <div>
        {currentUserId !== userOneId && userOne?.name}
        {currentUserId !== userTwoId && userTwo?.name}
      </div>
    </Link>
  );
};

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);

  //    Auth guard
  if (!session?.user) {
    redirect("/");
  }

  const fetchChats = async (userId: string) => {
    const response = await fetch("api/chats", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data: { success: boolean; chats: Chat[] } = await response.json();
      if (data.success) {
        return data.chats;
      }
    }

    return [];
  };

  const fetchUser = async (userId: string) => {
    const response = await fetch("api/fetchUser", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data: ChatUser[] = await response.json();
      if (data.length > 0) {
        return data[0];
      }
    }
  };

  useEffect(() => {
    fetchChats(session.user.userData.userId).then(async (chats) => {
      const chatsWithUsers = await Promise.all(
        chats.map(async (chat) => {
          const user_data_one = await fetchUser(chat.user_one);
          const user_data_two = await fetchUser(chat.user_two);

          return {
            ...chat,
            user_data_one,
            user_data_two,
          };
        })
      );
      setChats(chatsWithUsers);
    });
  }, []);

  return (
    <main className="mt-20 grid h-fit w-screen grid-cols-5">
      <section className="col-span-1 col-start-1">
        <Link href={"/chat"}>
          <h2>Chats</h2>
        </Link>
        {chats.map((chat) => (
          <LinkChat
            key={crypto.randomUUID()}
            chatId={String(chat.id)}
            userOne={chat.user_data_one}
            userOneId={chat.user_one}
            userTwo={chat.user_data_two}
            userTwoId={chat.user_two}
            currentUserId={session.user.userData.userId}
          />
        ))}
      </section>

      <section className="col-span-4 col-start-2">{children}</section>
    </main>
  );
};

export default ChatLayout;
