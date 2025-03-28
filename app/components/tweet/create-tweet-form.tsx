import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import TweetFormClient from "./create-tweet-form-client";

export default function CreateTweetForm({ user }: { user: User }) {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title")).trim();
    const supabase = createServerActionClient<Database>({ cookies });
    await supabase.from("tweets").insert({ title, user_id: user.id });
  };

  return <TweetFormClient user={user} addTweet={addTweet} />;
}
