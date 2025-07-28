// pages/UserManagement/change-password.tsx
import Head from "next/head"
import { useRouter } from "next/router"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { trpc } from "../../utils/trpc"

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

type FormValues = z.infer<typeof schema>

export default function ChangePassword() {
  const router = useRouter()
  const { code } = router.query

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const { mutate: resetPassword, isLoading } =
    trpc.user.resetForgotPassword.useMutation({
      onError(err: any) {
        console.error(err)
        setError(err.message)
      },
      onSuccess() {
        setSubmitted(true)
      },
    })

  const onSubmit = (data: FormValues) => {
    if (typeof code !== "string") {
      setError("Invalid or missing reset code.")
      return
    }
    resetPassword({ code, newPassword: data.password })
  }

  return (
    <>
      <Head>
        <title>Change Password</title>
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
                Change Password
              </h3>
              {submitted ? (
                <div className="text-green-600">
                  Password changed successfully! You can now log in.
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">New Password</label>
                    <input
                      type="password"
                      {...register("password")}
                      className="w-full rounded border border-gray-300 p-2 focus:border-tangerine-500 focus:outline-none"
                    />
                    {errors.password && (
                      <span className="text-xs text-red-500">
                        {errors.password.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      {...register("confirm")}
                      className="w-full rounded border border-gray-300 p-2 focus:border-tangerine-500 focus:outline-none"
                    />
                    {errors.confirm && (
                      <span className="text-xs text-red-500">
                        {errors.confirm.message}
                      </span>
                    )}
                  </div>

                  {error && (
                    <div className="text-xs italic text-red-500">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full rounded bg-tangerine-500 px-4 py-2 font-medium text-white hover:bg-tangerine-400 disabled:bg-gray-300"
                  >
                    {isSubmitting || isLoading
                      ? "Saving..."
                      : "Change Password"}
                  </button>
                </form>
              )}
              <div className="text-xs text-gray-500">
                <span
                  onClick={() => router.push("/")}
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
