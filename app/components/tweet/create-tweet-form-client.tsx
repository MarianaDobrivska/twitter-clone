"use client";
import { useRef, useTransition } from "react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

export default function TweetFormClient({
  user,
  addTweet,
}: {
  user: User;
  addTweet: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;

    if (!title.trim()) return;

    startTransition(async () => {
      await addTweet(formData);
      if (formRef.current) {
        formRef.current.reset();
      }
    });
  };

  return (
    <form
      ref={formRef}
      className="border border-gray-800 border-t-0 relative "
      onSubmit={handleSubmit}>
      <div className="flex py-8 px-4">
        <div className="h-12 w-12">
          <Image
            src={user.user_metadata.avatar_url ?? "/avatar-placeholder.png"}
            alt="user avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <input
          name="title"
          className="bg-inherit flex-1 ml-2 text-2xl outline-none leading-loose placeholder-gray-500 px-2"
          placeholder={isPending ? "Publishing..." : "What is happening?!"}
          disabled={isPending}
          maxLength={100}
        />
        {isPending && (
          <div className="absolute top-[40%] right-4 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </form>
  );
}
