import Posts from "../components/Posts";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import pawImg from "@/public/R.png";
import Head from "next/head";
import Link from "next/link";
import { signOut } from "next-auth/react";
export default function Home({ sessionInfo }: { sessionInfo: Session }) {
  return (
    <>
      <Head>
        <title>Petster</title>
      </Head>
      <div className="flex flex-col h-full bg-gray-100 ">
        <header className="bg-white border-b border-gray-300 flex flex-row items-center justify-center px-4 py-2">
          <div className="basis-1/4 w-8 ">
            <Link href={"/"}>
              <h1 className="font-pacifico text-center text-2xl">Petster</h1>
            </Link>
          </div>
          <div className="basis-1/2 grow flex items-center justify-center">
            <Link href={"/about"}>
              <img className="h-8 w-8  " src={pawImg.src} alt="Petster Logo" />
            </Link>
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
          <div className="flex flex-col items-center">
            {/* Main Content */}

            <Posts session={sessionInfo}></Posts>
          </div>
        </main>
        <footer className="bg-white border-t border-gray-300 h-16 px-4">
          {/* Footer Content */}
        </footer>
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const sessionAuth = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!sessionAuth) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: {
      sessionInfo: sessionAuth,
    },
  };
};
