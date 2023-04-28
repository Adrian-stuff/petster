import Head from "next/head";
import Link from "next/link";
import React from "react";
export default function About() {
  return (
    <>
      <Head>
        <title>About Page</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-full mx-10">
        <span className="mt-12 font-pacifico text-black text-center text-5xl">
          <Link href={"/"}>Petster</Link>
        </span>
        <p className="mt-2 text-md text-gray-800">
          a website for your pets, made with {"<3"} by group 2.
        </p>
        <p className="mt-2 text-center">
          <span className="font-bold text-lg">Members:</span> <br />
          Barbacena, Kate Jirah <br />
          Sajolan, Shane <br />
          Baroro, Maxiene <br />
          Repana, Jellian <br />
          Barrientos, Mary Joy <br />
          Bantog, Johance Niel <br />
          Bueno, John Rey <br />
          Santiago, Alfred John <br />
          Sison, John Robert
        </p>
      </div>
    </>
  );
}
