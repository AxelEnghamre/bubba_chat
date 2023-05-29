import supabase from "@/lib/supabaseStore";
import { NextResponse } from "next/server";

const POST = async (request: Request) => {
  const body: { userId: string} = await request.json();

  const userId = body.userId;

  const { data, error } = await supabase
    .from("users")
    .select("name, image_url")
    .eq("id", userId);
    

  return NextResponse.json(data);
};

export { POST };
