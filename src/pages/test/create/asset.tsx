import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { InputField } from "../../../components/common/InputField";
import { trpc } from "../../../utils/trpc";

const AssetTesting = () => {
  const { data: session } = useSession();
  const { isLoading, data, error, mutate } = trpc.asset.create.useMutation();

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session && (
        <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
          <h3 className="text-xl md:text-[2rem] leading-normal font-bold text-gray-700 mb-2">
            Create Assets
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData);

              mutate({
                name: data.name as string,
                number: data.number as string,
              });

              e.currentTarget.reset();
            }}
          >
            <InputField
              label="Asset name"
              name="name"
              placeholder="Enter asset name"
              required
            />
            <InputField
              label="Asset number"
              name="number"
              placeholder="Enter asset number"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-1 my-2 bg-amber-300 hover:bg-amber-400 text-white rounded"
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>
          {data && <p className="text-green-500 text-sm mt-2">{data}</p>}
          {error && (
            <pre className="text-red-500 text-sm mt-2 italic">
              {JSON.stringify(error, null, 2)}
            </pre>
          )}
        </main>
      )}
    </>
  );
};

export default AssetTesting;
