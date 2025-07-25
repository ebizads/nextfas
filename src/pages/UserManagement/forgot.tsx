// pages/UserManagement/forgot-password.tsx
import Head from "next/head"
import { useRouter } from "next/router"
import Image from "next/image"
import { useState, useEffect } from "react"
import { trpc } from "../../utils/trpc"
import { useSession } from "next-auth/react"
import { sendForgotEmail } from "../../utils/send-email"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// ✅ define form schema
const schema = z.object({
  email: z.string().email("Invalid email address"),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPassword() {
  const router = useRouter()
  const { status } = useSession()

  const [timer, setTimer] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.push("/dashboard")
  //   }
  // }, [router, status])

  const {
    register,
    handleSubmit,
    clearErrors,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(z.object({ email: z.string().email() })),
  })

  const { mutate: token, status: tokenStatus } =
    trpc.user.generateForgotToken.useMutation({
      onError(e) {
        console.log(e.message, "check error")
        setTimer(0)
        setError(e.message)
        setIsError(true)
      },
      async onSuccess(data) {
        try {
          const res = await sendForgotEmail({
            name: data.name,
            code: data.token,
            sendTo: data.email,
            date: data.date,
            baseUrl: window?.location?.origin,
          })
          console.log("Email sent, preview URL:", res.previewUrl)

          console.log("Reset email requested for:", data.email)
          setSubmitted(true)
          if (res.success) {
            setTimer(60)
            setSendSuccess(true)
            setSubmitted(true)
          } else {
            setIsError(true)
            setError(res.message)
          }
        } catch (e: any) {
          setIsError(true)
          setError(e.message)
        }
      },
    })

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1
        } else {
          // console.log("check if enter");
          clearInterval(intervalId)

          return prevTimer
        }
      })
    }, 1000) // Refresh every second

    // Clean up the timer to avoid memory leaks
    return () => clearInterval(intervalId)
  }, [timer])

  useEffect(() => {
    if (errors.email) {
      console.log(errors, "errors checker")
      setError("Email is empty.")
      setIsError(true)
    }
  }, [errors])

  const onSubmit = (data: any) => {
    setIsError(false)
    setSendSuccess(false)
    setError(null)
    token({ email: data.email })
    // console.log(data.email, "check code");
    if (data.email) {
      token(data.email.toString())
    }
  }

  return (
    <>
      <Head>
        <title>Forgot Password</title>
        <meta name="description" content="Reset your password" />
      </Head>

      <main className="flex min-h-screen items-center justify-center border">
        <div className="grid h-[495px] w-[80%] rounded-3xl shadow-md transition-width duration-150 md:w-[70%] md:grid-cols-2 xl:w-[55%]">
          <div className="relative h-full w-full">
            <Image
              src="/login.svg"
              alt="no image"
              objectFit="cover"
              layout="fill"
              className="rounded-tl-3xl md:rounded-bl-3xl"
            />
          </div>
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-[65%] space-y-8">
              <h3 className="text-xl font-bold leading-normal text-tangerine-500 md:text-[2rem]">
                {submitted ? "Thank you!" : "Forgot Password"}
              </h3>

              {submitted ? (
                <div className="text-green-600">
                  If an account with that email exists, a reset link has been
                  sent.
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col space-y-4"
                >
                  <label className="text-sm font-medium">
                    Enter your email address
                  </label>
                  <input
                    type="email"
                    // required
                    // value={email}
                    {...register("email")}
                    // onChange={(e) => setEmail(e.target.value)}
                    className="rounded border border-gray-300 p-2 focus:border-tangerine-500 focus:outline-none"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500">
                      {errors.email?.message as string}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="rounded bg-tangerine-500 px-4 py-2 font-medium text-white hover:bg-tangerine-400"
                    disabled={timer !== 0}
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
          </div>
        </div>
      </main>
    </>
  )
}
