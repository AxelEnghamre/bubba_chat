"use client";
import supabase from "@/lib/supabaseStore";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ChatRow = {
  id: string;
  created_at: string;
  user_one: string;
  user_two: string;
};

type ChatAuthorization = {
  success: boolean;
  chat?: ChatRow;
  error?: string;
};

const Bubba = ({ params }: { params: { chatId: string } }) => {
  const { data: session } = useSession();
  const [chatRow, setChatRow] = useState<ChatRow>();
  const [messages, setMessages] = useState([]);
  const [otherUserName, setOtherUserName] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [messageValue, setMessageValue] = useState("");
  const [CurrentUserImageUrl, setCurrentUserImageUrl] = useState<string>("");
  const [OtherUserImageUrl, setOtherUserImageUrl] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!session?.user) {
    redirect("/");
  }

  const chatAuthorization = async ({
    chatId,
    userId,
  }: {
    chatId: string;
    userId: string;
  }): Promise<boolean | ChatRow> => {
    const response = await fetch("../../api/chatAuthorization", {
      method: "POST",
      body: JSON.stringify({
        chatId,
        userId,
      }),
    });

    const data: ChatAuthorization = await response.json();

    if (!data.error) {
      if (data.chat) {
        return data.chat;
      }
    }

    return false;
  };

  const fetchUser = async (userId: string) => {
    const res = await fetch("../../api/fetchUser", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data) {
      console.log(data);
    }
    return data;
  };

  const sendMessage = async () => {
    if (!messageValue.trim()) {
      return;
    }

    const res = await fetch("../../api/sendMessage", {
      method: "POST",
      body: JSON.stringify({
        chatId: params.chatId,
        userId: session.user.userData.userId,
        message: messageValue,
      }),
    });

    const data = await res.json();
    if (data) {
      console.log(data);
    }

    setMessageValue("");
    return data;
  };

  useEffect(() => {
    chatAuthorization({
      chatId: params.chatId,
      userId: session.user.userData.userId,
    }).then((authData) => {
      if (typeof authData === "object") {
        setChatRow(authData);
      } else {
        redirect("/chat");
      }
    });

    // Fetch initial data from the table
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", params.chatId);
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setMessages(data);
      }
    };

    // Subscribe to changes in the table
    const subscribeToChanges = () => {
      const subscription = supabase
        .channel(`chat_${params.chatId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            console.log("Change received!", payload);
            // Update the messages state with the latest data
            fetchMessages();
          }
        )
        .subscribe();

      return subscription;
    };

    fetchMessages(); // Fetch initial data
    const subscription = subscribeToChanges(); // Subscribe to changes

    return () => {
      subscription.unsubscribe(); // Unsubscribe when the component unmounts
    };
  }, []);

  useEffect(() => {
    fetchUser(
      chatRow?.user_one === session.user.userData.userId
        ? chatRow?.user_two ?? ""
        : chatRow?.user_one ?? ""
    ).then((data) => {
      if (data) {
        setOtherUserName(data[0].name);
        setOtherUserImageUrl(data[0].image_url);
      }
    });
    fetchUser(session.user.userData.userId).then((data) => {
      if (data) {
        setCurrentUserName(data[0].name);
        setCurrentUserImageUrl(data[0].image_url);
      }
    });
  }, [chatRow]);

  useEffect(() => {
    // Send message if enter is pressed
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [messageValue]);

  useEffect(() => {
    // Scroll to the bottom of the messages when they update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  console.log("messages", messages);
  console.log("chatRow", chatRow);
  console.log("otherUserName", otherUserName);

  return (
    <main className="flex h-screen w-full flex-1 flex-col  text-center">
      {/* {JSON.stringify({
        chatRow,
      })} */}
      <AnimatePresence>
        <div className="mt-4 flex flex-1 flex-col overflow-y-scroll px-4 py-2">
          {messages.map((message) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                type: "spring",
                bounce: 0.25,
                stiffness: 500,
                damping: 30,
              }}
              key={message.id}
              className="my-2 flex flex-col"
            >
              <div
                className={`
              ${
                message.user_id === session.user.userData.userId
              } text-md flex flex-row items-center text-white
              `}
              >
                <Image
                  className="rounded-full"
                  src={
                    message.user_id === session.user.userData.userId
                      ? CurrentUserImageUrl
                      : OtherUserImageUrl
                  }
                  alt="user image"
                  width={40}
                  height={40}
                />
                <div className="ml-2 flex flex-col">
                  <div className="flex flex-row items-center text-sm font-bold text-white text-zinc-100">
                    {message.user_id === session.user.userData.userId
                      ? currentUserName
                      : otherUserName}
                  </div>
                  <div
                    className={`${
                      message.user_id === session.user.userData.userId
                    }
              text-md flex flex-row items-center text-zinc-200
              `}
                  >
                    {message.message}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </AnimatePresence>

      <div className="sticky bottom-0 flex w-full flex-row items-center justify-center bg-zinc-800 px-8 py-4">
        <input
          id="message-input"
          className="w-full rounded-md border-2 border-black px-4 py-2 text-black"
          type="text"
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
        />
        <button
          className="text-md ml-2 rounded-md bg-zinc-700 px-2 px-4 py-2 font-bold text-white transition duration-200 ease-in-out hover:bg-violet-500"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </main>
  );
};

export default Bubba;
