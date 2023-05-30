"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

const Chat = () => {
  const { data: session } = useSession();
  const [chatWithEmail, setChatWithEmail] = useState("");

  const createChat = async (userOneId: string, userTwoId: string) => {
    await fetch("api/createChat", {
      method: "POST",
      body: JSON.stringify({
        userOne: userOneId,
        userTwo: userTwoId,
      }),
    });
  };

  const fetchUserWithEmail = async (email: string) => {
    const response = await fetch("api/fetchUserWithEmail", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });

    if (response.ok) {
      const data: {
        description: string | null;
        email: string;
        id: string;
        image_url: string | null;
        name: string | null;
      }[] = await response.json();

      if (data.length > 0) {
        return data[0];
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setChatWithEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const otherUser = await fetchUserWithEmail(chatWithEmail);

    if (otherUser) {
      createChat(session?.user.userData.userId, otherUser.id);
    }
  };

  return (
    <section className="flex h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold">Add a friend!👋</h1>
      <form
        onSubmit={handleSubmit}
        className="flex h-12 w-1/2 flex-row items-center justify-between gap-2"
      >
        <input
          type="email"
          value={chatWithEmail}
          onChange={handleChange}
          className="h-full grow rounded-md bg-zinc-900 p-2 text-lg text-gray-500 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-opacity-50"
          placeholder="Email.to@your.friend"
        />
        <button
          type="submit"
          className="text-md bg-rose😴-600 h-full rounded-md p-2 font-bold tracking-wider text-white transition-colors duration-300 hover:bg-rose-700"
        >
          Create Chat
        </button>
      </form>
    </section>
  );
};

export default Chat;
