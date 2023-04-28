import React, { useEffect, useState } from "react";
import { PostData } from "../post/[postId]";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import firebase_app from "../../config";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import Post from "./Post";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import ImageUploader from "./PostUpload";
import { useRouter } from "next/router";

export interface PostDataImage extends PostData {
  image: string;
  comments: [{ username: string; comment: string }];
  likes: string[] | undefined;
  likedPhoto: boolean;
}
export default function Posts({ session }: { session: Session }) {
  const [postData, setPostData] = useState<PostDataImage[]>([]);
  const router = useRouter();
  useEffect(() => {
    const db = getFirestore(firebase_app);
    const storage = getStorage(firebase_app);
    const postsRef = collection(db, "posts");
    const postQuery = query(postsRef);
    const postArray: PostDataImage[] = [];
    let arrayLength = 0;
    console.log(session);
    getDocs(postQuery).then(async (data) => {
      data.forEach(async (val) => {
        console.log(val.data());
        const postData = val.data() as PostDataImage;
        const imageRef = ref(storage, `posts/${val.id}/image`);
        let imageUrl;
        try {
          imageUrl = await getDownloadURL(imageRef);
        } catch (error) {
          arrayLength += 1;
          return;
        }
        let userLikedPhoto = false;
        if (session.user?.email && postData.likes) {
          userLikedPhoto = postData.likes.includes(session?.user?.email);
        }
        postArray.push({
          ...postData,
          image: imageUrl,
          likedPhoto: userLikedPhoto,
          comments:
            (val.data().comments as [{ username: string; comment: string }]) ??
            [],
        });
        // console.log(val.data().comments[]);
        console.log(data.size, postArray.length + arrayLength);
        if (data.size === postArray.length + arrayLength) {
          setPostData(postArray);
        }
      });

      console.log(postArray);
    });
    // const imageRef = ref(storage, `posts/${postData.postID}/image`);
  }, []);
  return (
    <div className="flex flex-col mx-3">
      <div className=" ">
        <ImageUploader></ImageUploader>
      </div>
      {postData.length !== 0 ? (
        postData.map((val) => {
          return (
            <div key={val.postID}>
              <Post
                postData={val}
                comments={val.comments}
                session={session}
              ></Post>
            </div>
          );
        })
      ) : (
        <h1>loading </h1>
      )}
    </div>
  );
}
