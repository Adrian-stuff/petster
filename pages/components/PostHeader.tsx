import Link from "next/link";
import React from "react";

export default function PostHeader({
  username,
  profileImg,
}: {
  username: string;
  profileImg: string;
}) {
  return (
    <div className="flex border-b border-gray-primary h-4 p-4 py-8">
      <div className="flex items-center">
        <div className="flex items-center">
          <img
            className="rounded-full h-8 w-8 flex mr-3"
            src={profileImg}
            alt={`${username} profile picture`}
          />
          <p className="font-bold">{username}</p>
        </div>
      </div>
    </div>
  );
}
