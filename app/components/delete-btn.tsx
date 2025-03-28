"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { toast } from "react-toastify";

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
      toast.success("Tweet deleted successfully.");
      console.log("Tweet deleted successfully.");
    } catch (error) {
      toast.error("Error deleting tweet. Please try again.");
      console.error("Error deleting tweet:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      disabled={loading}
      className="text-lg text-gray-400"
      onClick={onClick}>
      🗙
    </button>
  );
}
