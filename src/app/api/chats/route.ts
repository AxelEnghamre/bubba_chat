import supabase from "@/lib/supabaseStore";
import { NextResponse } from "next/server";

const POST = async (request: Request) => {
  const body: { userId: string } = await request.json();

  console.log("API chats");
  console.log(body);

  const userId = body.userId;

  const { data, error } = await supabase
    .from("chats")
    .select()
    .or(`user_one.eq.${userId},user_two.eq.${userId}`);

  console.log(data);

  const j = JSON.stringify({ chats: ["hej"] });
  return NextResponse.json(j);
};

export { POST };
