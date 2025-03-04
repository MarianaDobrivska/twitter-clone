"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import LoginModal from "./login-modal";

const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || location.origin;

export default function GitHubButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${redirectUrl}/auth/callback` },
    });
  };
  const onOpen = () => {
    setIsModalOpen(true);
  };
  const onClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <button
        onClick={handleSignIn}
        className="hover:bg-gray-800 p-8 rounded-xl">
        <Image
          src="/github-mark-white.png"
          alt="GitHub logo"
          width={100}
          height={100}
          priority
        />
      </button>
      <button className="hover:bg-gray-800 p-8 rounded-xl" onClick={onOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FEFEFE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-at-sign">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
        </svg>
      </button>
      {isModalOpen && <LoginModal onClose={onClose} />}
    </div>
  );
}
