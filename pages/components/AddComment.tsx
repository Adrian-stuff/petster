import {
  useState,
  useContext,
  LegacyRef,
  Dispatch,
  SetStateAction,
} from "react";
import PropTypes from "prop-types";
import {
  arrayUnion,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import firebase_app from "../../config";

export default function AddComment({
  postId,
  comments,
  setComments,
  commentInput,
  username: displayName,
}: {
  postId: string;
  comments: any[];
  setComments: Dispatch<SetStateAction<any[]>>;
  commentInput: LegacyRef<HTMLInputElement> | undefined;
  username: string;
}) {
  const [comment, setComment] = useState("");

  const handleSubmitComment = async (event: any) => {
    event.preventDefault();
    const db = getFirestore(firebase_app);
    const postRef = doc(db, "posts", postId);
    setComments([...comments, { username: displayName, comment }]);
    setComment("");

    await updateDoc(postRef, {
      comments: arrayUnion({ username: displayName, comment: comment }),
    });
  };

  return (
    <div className="border-t border-gray-primary">
      <form
        className="flex justify-between pl-0 pr-5"
        onSubmit={(event) =>
          comment.length >= 1
            ? handleSubmitComment(event)
            : event.preventDefault()
        }
      >
        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="text-sm text-gray-base w-full mr-3 py-5 px-4"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-500 ${
            !comment && "opacity-25"
          }`}
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}
