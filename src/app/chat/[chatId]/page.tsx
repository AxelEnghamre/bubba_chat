"use client";
import supabase from "@/lib/supabaseStore";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

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
        .channel("custom-all-channel")
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
        ? chatRow?.user_two
        : chatRow?.user_one
    ).then((data) => {
      if (data) {
        setOtherUserName(data[0].name);
      }
    });
    fetchUser(session.user.userData.userId).then((data) => {
      if (data) {
        setCurrentUserName(data[0].name);
      }
    });
  }, [chatRow]);

  console.log("messages", messages);
  console.log("chatRow", chatRow);
  console.log("otherUserName", otherUserName);

  return (
    <main>
      {JSON.stringify({
        chatRow,
      })}
      <div className="flex flex-col">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div
              className={`${
                message.user_id === session.user.userData.userId
                  ? "bg-green-500"
                  : "bg-red-500"
              } text-md font-bold`}
            >
              {
                message.user_id === session.user.userData.userId
                  ? currentUserName // Display the current user's name if the message was sent by them
                  : otherUserName // Display the other user's name if the message was sent by them
              }
            </div>
            <div
              className={`${
                message.user_id === session.user.userData.userId
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <input
          className="rounded-md border-2 border-black text-black"
          type="text"
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  );
};

export default Bubba;
