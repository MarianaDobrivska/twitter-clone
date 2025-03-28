"use client";
import { useState } from "react";
import Image from "next/image";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";

import Likes from "../likes";
import DeleteButton from "../delete-btn";

type TweetItemProps = {
  tweet: TweetWithAuthor;
  user: User;
  addOptimisticTweet: (tweet: TweetWithAuthor) => void;
};

const TweetItem = ({ tweet, user, addOptimisticTweet }: TweetItemProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(tweet.title);
  const supabase = createClientComponentClient<Database>();

  const isUserAuthor = user.id === tweet.user_id;

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setEditedTitle(tweet.title);
  };

  const handleUpdateTweet = async () => {
    try {
      const { error } = await supabase
        .from("tweets")
        .update({ title: editedTitle.trim() })
        .eq("id", tweet.id);

      if (error) throw new Error(error.message);
      toast.success("Tweet updated successfully.");
      console.log("Tweet updated successfully.");
    } catch (error) {
      setEditedTitle(tweet.title);
      toast.error("Error updating tweet. Please try again.");
      console.error("Error updating tweet:", error);
    }
  };

  const handleConfirmClick = () => {
    setEditMode(false);

    if (
      !tweet?.id ||
      editedTitle === tweet.title ||
      editedTitle.trim().length < 1
    ) {
      setEditedTitle(tweet.title);
    } else {
      handleUpdateTweet();
    }
  };

  return (
    <div
      key={tweet.id}
      className="border border-gray-800 border-t-0 px-4 py-8 flex relative ">
      {/* User Avatar */}
      <div className="h-12 w-12">
        <Image
          className="rounded-full"
          src={tweet.author.avatar_url ?? "/avatar-placeholder.png"}
          alt="user avatar"
          width={48}
          height={48}
        />
      </div>

      {/* Tweet Content */}
      <div className="ml-4 w-full">
        <p>
          {tweet.author.username && (
            <span className="font-bold mr-2">{tweet.author.username}</span>
          )}
          <span className="text-sm text-gray-400">{tweet.author.name}</span>
        </p>
        <textarea
          value={editedTitle}
          readOnly={!editMode}
          disabled={!editMode}
          maxLength={100}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && editMode) handleConfirmClick();
          }}
          className={`border py-[4px] w-full resize-none overflow-hidden ${
            editMode
              ? "border-gray-400 rounded-md px-[4px]"
              : "border-transparent"
          } bg-transparent`}
        />

        <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />

        {/* Action Buttons */}
        {isUserAuthor && (
          <div className="absolute top-5 right-5 flex gap-2">
            {editMode ? (
              <>
                <button
                  className="text-sm text-green-500"
                  onClick={handleConfirmClick}>
                  ✅
                </button>
                <button
                  className="text-lg text-red-400"
                  onClick={toggleEditMode}>
                  🗙
                </button>
              </>
            ) : (
              <>
                <button className="text-sm" onClick={toggleEditMode}>
                  ✏️
                </button>
                <DeleteButton tweet={tweet} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetItem;
