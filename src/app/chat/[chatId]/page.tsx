"use client";
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
  const [chatRow,setChatRow] = useState<ChatRow>();

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

  useEffect(() => {
    chatAuthorization({
      chatId: params.chatId,
      userId: session.user.userData.userId,
    }).then((authData)=>{
        if(typeof authData === "object") {
            setChatRow(authData);
        } else {
            redirect("/chat");
        }
    });
}, []);

// const messages = supabase.channel('custom-all-channel')
// .on(
//   'postgres_changes',
//   { event: '*', schema: 'public', table: 'messages' },
//   (payload) => {
//     console.log('Change received!', payload)
//   }
// )
// .subscribe();

  


  return <main>{JSON.stringify(chatRow)}</main>;
};

export default Bubba;
