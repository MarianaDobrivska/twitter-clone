"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export default function DeleteButton({ tweet }: { tweet: TweetWithAuthor }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient<Database>();

  const onClick = async () => {
    if (!tweet?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tweets")
        .delete()
        .eq("id", tweet.id);

      if (error) throw new Error(error.message);
      console.log("Tweet deleted successfully.");
    } catch (error) {
      console.error("Error deleting tweet:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      disabled={loading}
      className="text-sm text-gray-400 absolute top-5 right-5"
      onClick={onClick}>
      🗙
    </button>
  );
}
