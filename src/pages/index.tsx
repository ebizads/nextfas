import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          FAS <span className="text-purple-300">development</span> server
        </h1>
      </main>
    </>
  );
};

export default Home;
