import "./globals.css";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Twitter Clone",
  description:
    "This project, built with TypeScript, Next.js, and Tailwind CSS on the frontend, and Supabase for the backend, offers users the ability to sign in with GitHub or email. Users can createand share posts, view posts from other users, and interact by liking posts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-gray-900 min-h-screen flex">{children}</div>
        <ToastContainer />
      </body>
    </html>
  );
}
