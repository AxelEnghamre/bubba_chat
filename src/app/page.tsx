"use client";
import { useSession } from "next-auth/react";

const HomePage = () => {
  const { data: session } = useSession();
  return (
    <>
      {/* <main>
        <h1>Bubba</h1>

        {session?.user ? (
          <>
            <h2>{`Welcome ${session.user.name}`}</h2>
            <section>
              <h2>Contacts</h2>
            </section>
          </>
        ) : (
          <p>Bubba Chat is a nice chat application</p>
        )}
      </main> */}
      <main className="flex h-screen flex-col items-center justify-center gap-3 bg-zinc-900">
        {session?.user ? (
          <>
            <h1 className="text-2xl font-bold">
              Hello {session.user.name}! 👋
            </h1>
            <h2 className="text-lg">What are you waiting for? Add a friend!</h2>
            <h3 className="text-sm">
              psst... press chat to start chatting with your friends! 🤫
            </h3>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Welcome to Bubba Chat! 👋</h1>
            <p className="text-lg">Bubba Chat is a nice chat application</p>
          </>
        )}
      </main>
    </>
  );
};

export default HomePage;
