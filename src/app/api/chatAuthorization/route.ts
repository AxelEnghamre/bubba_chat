import supabase from "@/lib/supabaseStore";

const POST = async (request: Request) => {
  const body: { userId: string, chatId: string } = await request.json();

  const userId = body.userId;
  const chatId = body.chatId;


  if (userId && chatId) {
    const { data, error } = await supabase
      .from("chats")
      .select()
      .eq("id",chatId)
      .or(`user_one.eq.${userId},user_two.eq.${userId}`);


    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: "supabase error" }),
        {
          status: 500,
        }
      );
    }

    if (data.length > 0) {
      return new Response(JSON.stringify({ success: true, chat: data[0] }), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ success: false, chats: data }), {
      status: 401,
    });
  }

  return new Response(
    JSON.stringify({ success: false, error: "missing fields" }),
    {
      status: 417,
    }
  );
};

export { POST };