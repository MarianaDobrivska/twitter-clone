"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error(error.message);
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
      router.push("/");
    } catch (error: any) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      router.push("/");
    } catch (error: any) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!email || !password) {
      toast.info("Please fill out all fields", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }

    if (isSignUp) {
      signUp(email, password);
    } else {
      signIn(email, password);
    }
    (e.target as HTMLFormElement).reset();
  };

  const onSignUpClick = () => setIsSignUp((prev) => !prev);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 ">
      <div className="bg-white p-6 rounded shadow-md h-min w-96 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-3 text-gray-400 hover:text-gray-500 ">
          <span className="sr-only">Close</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-gray-800 text-xl font-bold mb-4 text-center leading-9 tracking-tight ">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-gray-800 flex flex-col text-sm font-medium leading-6 ">
            Enter email
            <input
              name="email"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 outline-none sm:text-sm sm:leading-6 p-4"></input>
          </label>
          <label className="text-gray-800 flex flex-col text-sm font-medium leading-6 mt-3">
            Enter password
            <input
              name="password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 outline-none sm:text-sm sm:leading-6 p-4"></input>
          </label>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md mt-5 bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {isSignUp ? "Register" : "Login"}
          </button>
        </form>
        <p className="text-gray-800 text-sm font-medium leading-6 mt-6 text-right">
          {!isSignUp ? "Doesn`t have an account?" : "Already have an account?"}
          <span
            onClick={onSignUpClick}
            className="text-blue-600 font-bold ml-2 cursor-pointer hover:underline hover:underline-offset-2 hover:decoration-1">
            {!isSignUp ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}
