import supabase from "@/lib/supabaseStore";
import { NextResponse } from "next/server";

const POST = async (request: Request) => {
  const body: { userId: string; chatId: string; message: string } =
    await request.json();
  console.log("API sendMessage");
  console.log(body);

  const message = body.message;
  const chatId = body.chatId;
  const userId = body.userId;

  const { data, error } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, user_id: userId, message: message }]);
  console.log(data);
  console.log(error);
  const j = JSON.stringify({ messages: ["hej"] });
  return NextResponse.json(j);
};

export { POST };
