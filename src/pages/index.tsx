import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          FAS <span className="text-amber-300">development</span> server
        </h1>
        <p className="text-gray-700">{session?.user?.name}</p>
        {session ? (
          <button
            className="px-4 py-1 bg-amber-300 text-white rounded my-2"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        ) : (
          <Link href="/auth/login">
            <a className="px-4 py-1 bg-amber-300 text-white rounded my-2">
              Sign in
            </a>
          </Link>
        )}
      </main>
    </>
  );
};

export default Home;
