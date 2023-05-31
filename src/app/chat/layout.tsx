"use client";
import supabase from "@/lib/supabaseStore";
import { Reorder } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
  //log chat order
  useEffect(() => {
    console.log(chats);
  }, [chats]);

  const subscribeToChanges = () => {
    const subscription = supabase
      .channel(`chat:${session.user.userData.userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        (payload) => {
          console.log("Change received!", payload);
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
        }
      )
      .subscribe();

    return subscription;
  };

  useEffect(() => {
    setChats((chats) => {
      const chatsCopy = [...chats];
      const newChats = chatsCopy.sort((a, b) => {
        const aDate = new Date(a.created_at);
        const bDate = new Date(b.created_at);
        return bDate.getTime() - aDate.getTime();
      });
      return newChats;
    });
    const subscription = subscribeToChanges(); // Subscribe to changes

    return () => {
      subscription.unsubscribe(); // Unsubscribe when the component unmounts
    };
  }, []);

  return (
    <main className="grid h-screen w-screen grid-cols-6 bg-zinc-800">
      <section className="col-span-1 col-start-1 overflow-y-scroll bg-zinc-900 pt-8">
        <Link href={"/chat"}>
          <h2 className="cursor-pointer text-center text-2xl font-bold tracking-wider text-rose-500 transition-colors duration-300 hover:text-rose-800">
            {" "}
            BUBBA{" "}
          </h2>
        </Link>
        <Reorder.Group
          axis="y"
          className="mt-4 flex h-screen flex-col gap-2 overflow-y-auto px-2"
          values={chats.map((chat) => chat.id)}
          onReorder={(values) => {
            setChats((chats) => {
              const chatsCopy = [...chats];
              const newChats = values.map((value) =>
                chatsCopy.find((chat) => chat.id === value)
              );
              return newChats as Chat[];
            });
          }}
        >
          {chats.map((chat) => (
            <Reorder.Item
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              layout
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={1}
              value={chat.id}
              key={chat.id} // Use chat.id as the key
              className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 p-2 shadow-md transition-colors hover:bg-rose-500 hover:text-zinc-900"
            >
              <Image
                src={
                  session.user.userData.userId !== chat.user_one
                    ? chat.user_data_one?.image_url ?? "next.svg"
                    : chat.user_data_two?.image_url ?? "next.svg"
                }
                alt="user image"
                width={30}
                height={30}
                style={{ borderRadius: "50%" }}
              />

              <LinkChat
                key={crypto.randomUUID()}
                chatId={String(chat.id)}
                userOne={chat.user_data_one}
                userOneId={chat.user_one}
                userTwo={chat.user_data_two}
                userTwoId={chat.user_two}
                currentUserId={session.user.userData.userId}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </section>
      <section className="col-span-5 col-start-2 overflow-y-hidden">
        {children}
      </section>
    </main>
  );
};

export default ChatLayout;
