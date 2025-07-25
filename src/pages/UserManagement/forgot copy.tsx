// pages/UserManagement/forgot-password.tsx
import Head from "next/head"
import { useState } from "react"
import { useRouter } from "next/router"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: replace this with real API call to send reset email
    console.log("Reset email requested for:", email)
    setSubmitted(true)
  }

  return (
    <>
      <Head>
        <title>Forgot Password</title>
        <meta name="description" content="Reset your password" />
      </Head>

      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-semibold text-tangerine-500">Forgot Password</h3>

          {submitted ? (
            <div className="text-green-600">
              If an account with that email exists, a reset link has been sent.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <label className="text-sm font-medium">Enter your email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded border border-gray-300 p-2 focus:border-tangerine-500 focus:outline-none"
              />

              <button
                type="submit"
                className="rounded bg-tangerine-500 px-4 py-2 font-medium text-white hover:bg-tangerine-400"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <div className="mt-4 text-xs text-gray-500">
            <span
              onClick={() => router.back()}
              className="cursor-pointer underline hover:text-tangerine-500"
            >
              Back to Login
            </span>
          </div>
        </div>
      </main>
    </>
  )
}
