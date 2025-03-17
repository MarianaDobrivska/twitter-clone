"use client";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import { experimental_useOptimistic as useOptimistic, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DeleteButton from "./delete-btn";

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

  const isUserAuthor = (tweet: TweetWithAuthor) => user.id === tweet.user_id;

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
    <div
      key={tweet.id}
      className="border border-gray-800 border-t-0 px-4 py-8 flex relative">
      <div className="h-12 w-12 ">
        <Image
          className="rounded-full"
          src={tweet.author.avatar_url ?? "/avatar-placeholder.png"}
          alt="user avatar"
          width={48}
          height={48}
        />
      </div>
      <div className="ml-4 ">
        <p>
          {tweet.author.username && (
            <span className="font-bold mr-2">{tweet.author.username}</span>
          )}
          <span className="text-sm text-gray-400">{tweet.author.name}</span>
        </p>
        <p>{tweet.title}</p>
        <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
        {isUserAuthor(tweet) && <DeleteButton tweet={tweet} />}
      </div>
    </div>
  ));
}
