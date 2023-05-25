import supabase from "@/lib/supabaseStore";
import { NextResponse } from "next/server";

const POST = async (request: Request) => {
  const body: { userOne: string; userTwo: string } = await request.json();

  const userOne = body.userOne;

  const { data, error } = await supabase
    .from("chats")
    .insert([{ user_one: userOne, user_two: body.userTwo }]);

  const j = JSON.stringify({ chats: ["hej"] });
  return NextResponse.json(j);
};

export { POST };
