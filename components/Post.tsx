import { useEffect, useRef } from "react";
import { PostData } from "../pages/post/[postId]";
import CircleImage from "./CircleImage";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import { PostDataImage } from "./Posts";
import PostComments from "./PostComments";
import { Session } from "next-auth";
import { LazyLoadImage } from "react-lazy-load-image-component";
export default function Post({
  postData,
  image,
  comments,
  session,
}: {
  postData: PostDataImage;
  comments: [{ username: string; comment: string }];
  image?: string;
  session: Session;
}) {
  const commentInput = useRef<HTMLInputElement>(null);
  const handleFocus = () => commentInput.current?.focus();

  return (
    <div className="rounded col-span-4 border bg-white border-gray-200 mb-12 max-w-xl">
      <PostHeader
        profileImg={postData.profileImg}
        username={postData.profileName}
      ></PostHeader>
      {/* <h1>{postData.caption}</h1> */}
      <div className=" flex justify-center">
        <LazyLoadImage
          src={image ? image : postData.image}
          alt={postData.caption}
        />
      </div>
      <PostActions
        postId={postData.postID}
        likedPhoto={postData.likedPhoto}
        totalLikes={postData.likes ? postData.likes.length : 0}
        userId={session.user?.email as string}
        handleFocus={handleFocus}
      ></PostActions>
      <div className="pl-4 mb-4">
        <h1 className="text-gray-800">{postData.caption}</h1>
      </div>

      <PostComments
        commentInput={commentInput}
        comments={comments}
        postId={postData.postID}
        username={session.user?.name as string}
      ></PostComments>
    </div>
  );
}
