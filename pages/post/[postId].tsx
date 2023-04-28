import React, { useCallback, useEffect, useState } from "react";
import firebase_app from "../../config";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { PostDataImage } from "../../components/Posts";
import Post from "../../components/Post";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import pawImg from "@/public/R.png";

import Head from "next/head";
import { signOut } from "next-auth/react";
import Link from "next/link";
export interface PostData {
  caption: string;
  postID: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  profileImg: string;
  user: string;
  profileName: string;
}

export default function PostPage({
  postData,
  image,
  sessionInfo,
}: {
  postData: PostDataImage;
  image: string;
  sessionInfo: Session;
}) {
  return (
    <>
      <Head>
        <title>Petster</title>
      </Head>
      <div className="flex flex-col h-full bg-gray-100 ">
        <header className="bg-white border-b border-gray-300 flex flex-row items-center justify-center px-4 py-2">
          <div className="basis-1/4 w-8 ">
            <Link href="/">
              <h1 className="font-pacifico text-center text-2xl">Petster</h1>
            </Link>
          </div>
          <div className="basis-1/2 grow flex items-center justify-center">
            <img className="h-8 w-8  " src={pawImg.src} alt="Petster Logo" />
          </div>
          <div className="basis-1/4 flex items-center justify-end">
            <img
              className="h-8 rounded-full w-8"
              src={sessionInfo.user?.image as string}
              alt="User Profile"
            />
            <button onClick={() => signOut()} className="ml-4 font-bold">
              Log out
            </button>
          </div>
        </header>
        <main className="flex justify-center">
          <div className="flex flex-col items-center mt-4">
            {/* Main Content */}

            <Post
              postData={postData}
              comments={postData.comments}
              image={image}
              session={sessionInfo}
            ></Post>
          </div>
        </main>
        <footer className="bg-white border-t border-gray-300 h-16 px-4">
          {/* Footer Content */}
        </footer>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const db = getFirestore(firebase_app);
  const postRef = doc(db, "posts", ctx.query.postId);
  const postSnap = await getDoc(postRef);
  const sessionAuth = await getServerSession(ctx.req, ctx.res, authOptions);
  const storage = getStorage(firebase_app);
  let error = false;
  let imageUrl;
  try {
    const imageRef = ref(storage, `posts/${postSnap.id}/image`);

    imageUrl = await getDownloadURL(imageRef);
  } catch (e) {
    error = true;
  }
  if (postSnap.exists() && sessionAuth && !error) {
    console.log(postSnap.data());
    return {
      props: {
        postData: JSON.parse(JSON.stringify(postSnap.data())),
        sessionInfo: sessionAuth,
        image: imageUrl,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};
