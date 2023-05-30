import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import supabase from "./supabaseStore";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn", user, account, profile, email, credentials);
      const { data: users, error } = await supabase
        .from("users")
        .insert([
          {
            email: user?.email,
            name: user?.name,
            image_url: user?.image,
            description: "This is a description",
          },
        ]);
        console.log("users", users);
        console.log("error", error);
      return true;
    },
    async session({ session, token }) {
      const { data } = await supabase
        .from("users")
        .select()
        .eq("email", session.user?.email)
        .single();
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          userData: {
            userId: data?.id,
            userName: data?.name,
            userDescription: data?.description,
          },
        },
      };
    },
  },
};
export default authOptions;
