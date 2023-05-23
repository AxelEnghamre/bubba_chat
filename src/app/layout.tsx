import Navigation from "@/components/Navigation";
import NextAuthProvider from "@/providers/NextAuthProvider";
import "@/styles/globals.css";

const metadata = {
  title: "Bubba Chat",
  description: "Developed by Adam Garali & Axel Enghamre",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <Navigation />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;

export { metadata };
