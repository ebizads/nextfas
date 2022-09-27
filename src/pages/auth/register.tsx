import Head from "next/head";
import Link from "next/link";
import React from "react";
import { InputField } from "../../components/common/InputField";
import { trpc } from "../../utils/trpc";

// TODO input validations
const Register = () => {
  const { mutate, isLoading, error } = trpc.auth.register.useMutation();

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <h3 className="text-xl md:text-[2rem] leading-normal font-bold text-gray-700 mb-2">
          Register
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData);

            mutate({
              email: data.email as string,
              password: data.password as string,
              name: `${data.first_name} ${data.last_name}`,
              profile: {
                first_name: data.first_name as string,
                last_name: data.last_name as string,
              },
            });
          }}
          className="flex flex-col space-y-4"
        >
          <InputField
            label="First Name"
            name="first_name"
            placeholder="Enter first name"
            required
          />
          <InputField
            label="Last Name"
            name="last_name"
            placeholder="Enter last name"
            required
          />
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
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
        {error && (
          <pre className="text-red-500 text-sm mt-2 italic">
            Something went wrong!
          </pre>
        )}
        <Link href="/auth/login">
          <a className="px-4 py-1 text-amber-300 hover:text-amber-400 underline my-2">
            Login
          </a>
        </Link>
      </main>
    </>
  );
};

export default Register;
