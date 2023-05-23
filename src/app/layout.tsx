import "@/styles/globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";

const metadata = {
  title: "Bubba Chat",
  description: "Developed by Adam Garali & Axel Enghamre",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;

export { metadata };
