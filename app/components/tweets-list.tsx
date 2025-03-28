"use client";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { experimental_useOptimistic as useOptimistic, useEffect } from "react";
import { useRouter } from "next/navigation";

import TweetItem from "./tweet/tweet-item";

export default function Tweets({
  tweets,
  user,
}: {
  tweets: TweetWithAuthor[];
  user: User;
}) {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweets, newTweet) => {
    const newOptimisticTweets = [...currentOptimisticTweets];
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );
    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  });
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return optimisticTweets.map((tweet) => (
    <TweetItem
      key={tweet.id}
      tweet={tweet}
      user={user}
      addOptimisticTweet={addOptimisticTweet}
    />
  ));
}
