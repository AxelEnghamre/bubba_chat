import supabase from "@/lib/supabaseStore";

const POST = async (request: Request) => {
  const body: { userId: string } = await request.json();

  const userId = body.userId;

  if (userId) {
    const { data, error } = await supabase
      .from("chats")
      .select()
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
      return new Response(JSON.stringify({ success: true, chats: data }), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ success: false, chats: data }), {
      status: 401,
    });
  }

  return new Response(
    JSON.stringify({ success: false, error: "missing userId" }),
    {
      status: 417,
    }
  );
};

export { POST };
