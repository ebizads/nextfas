import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/common/InputField";

// TODO input validations
const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <h3 className="text-xl md:text-[2rem] leading-normal font-bold text-gray-700 mb-2">
          Login
        </h3>
        <form
          onSubmit={async (e) => {
            setIsLoading(true);
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData);

            const user = await signIn("credentials", {
              redirect: false,
              email: data.email,
              password: data.password,
              callbackUrl: "/",
            });

            setIsLoading(false);

            if (user?.error) {
              setError(user.error);
            } else {
              router.push(user?.url as string);
            }

            setIsLoading(false);
          }}
          className="flex flex-col space-y-4"
        >
          <InputField label="Email" name="email" placeholder="Enter email" />
          <InputField
            label="Password"
            name="password"
            placeholder="Enter password"
            type="password"
            required
          />
          <button
            type="submit"
            className="px-4 py-1 bg-amber-300 hover:bg-amber-400 text-white rounded"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        {error && (
          <pre className="text-red-500 text-sm mt-2 italic">
            Something went wrong!
          </pre>
        )}
        <Link href="/auth/register">
          <a className="px-4 py-1 text-amber-300 hover:text-amber-400 underline my-2">
            Register
          </a>
        </Link>
      </main>
    </>
  );
};

export default Login;
