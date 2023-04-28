import { LegacyRef, useState } from "react";
import PropTypes from "prop-types";
import AddComment from "./AddComment";
import Link from "next/link";
export default function PostComments({
  postId,
  comments: allComments,
  commentInput,
  username,
}: {
  postId: string;
  comments: [{ username: string; comment: string }];
  commentInput: LegacyRef<HTMLInputElement> | undefined;
  username: string;
}) {
  const [comments, setComments] = useState<any[]>(allComments);
  const [commentsSlice, setCommentsSlice] = useState(3);

  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 3);
  };

  return (
    <>
      {comments ? (
        <div className="p-4 pt-1 pb-4">
          {comments.slice(0, commentsSlice).map((item: any) => (
            <p key={`${item.comment}-${item.username}`} className="mb-1">
              <span className="mr-1 font-bold">{item.username}</span>
              <span>{item.comment}</span>
            </p>
          ))}
          {comments.length >= 3 && commentsSlice < comments.length && (
            <button
              className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
              type="button"
              onClick={showNextComments}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  showNextComments();
                }
              }}
            >
              View more comments
            </button>
          )}
        </div>
      ) : (
        ""
      )}
      <AddComment
        postId={postId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
        username={username}
      />
    </>
  );
}
