import type { NextPage } from "next"
import { signOut, useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import { trpc } from "../utils/trpc"
import { useEffect } from "react"
import { useRouter } from "next/router"

const Home: NextPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { data } = trpc.asset.findAll.useQuery({
    page: 1,
    limit: 1,
  })

  useEffect(() => {
    router.push("/assets")
  })

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          FAS <span className="text-amber-300">development</span> server
        </h1>
        <p className="text-gray-700">{session?.user?.name}</p>
        {session ? (
          <button
            className="my-2 rounded bg-amber-300 px-4 py-1 text-white"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        ) : (
          <Link href="/auth/login">
            <a className="my-2 rounded bg-amber-300 px-4 py-1 text-white">
              Sign in
            </a>
          </Link>
        )}
      </main>
    </>
  )
}

export default Home
