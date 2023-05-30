import supabase from "@/lib/supabaseStore";
import { NextResponse } from "next/server";

const POST = async (request: Request) => {
  const body: { email: string} = await request.json();

  const email = body.email;

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email);
    

  return NextResponse.json(data);
};

export { POST };