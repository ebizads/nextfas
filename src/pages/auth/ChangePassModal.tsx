import { useForm } from "react-hook-form"
import { z } from "zod/lib"
import { ChangeUserPass } from "../../server/schemas/user"
import { zodResolver } from "@hookform/resolvers/zod"
import InputField from "../../components/atoms/forms/InputField"
import { trpc } from "../../utils/trpc"
import { Textarea } from "@mantine/core"
import { useEffect, useState } from "react"
import PasswordChecker from "../../components/atoms/forms/PasswordChecker"
import Modal from "../../components/headless/modal/modal"
import { passConfirmCheck } from "../../lib/functions"
import { useSession } from "next-auth/react"
// import bcrypt from "bcrypt"

// import { useSession } from "next-auth/react"

type ChangePass = z.infer<typeof ChangeUserPass>

export const ChangePassModal = (props: {
  isVisible: boolean
  setVisibile: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [passIncorrect, setPassIncorrect] = useState<boolean>(false)
  const [confirmPass, setConfirmPass] = useState<boolean>(true)
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { data: session } = useSession()

  const { mutate } = trpc.user.change.useMutation({
    onSuccess() {
      setIsVisible(true)
      // invalidate query of asset id when mutations is successful
    },
    onError(){
      console.log(error)
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePass>({
    resolver: zodResolver(ChangeUserPass),
    defaultValues: {
      firstLogin: true,
      password: "",
      id: Number(session?.user?.id),
      passwordAge: 1,
    },
  })

  // const encryptPass = async () =>{
  //   const match = await bcrypt.compare(password, "$2b$10$Yc8Z.neAGmNltMqoM36eG.kI9TpoUPAMljttwI5niA2nNjaKClIim")
  //   console.log(match.toString())
  // }

  const onSubmit = (changeUserPass: ChangePass) => {
    setConfirmPass(passConfirmCheck(password, confirmPassword))

    

    if (confirmPass) {
      mutate({
        ...changeUserPass,
        oldPassword: changeUserPass.oldPassword,
        password: changeUserPass.password,
      })
      reset()
    } else {
      setPassIncorrect(true)
      console.log(error)
    }
  }

  return (
    <Modal
      isVisible={props.isVisible}
      setIsVisible={props.setVisibile}
      className="max-w-4xl"
      title="Change Password"
    >
      <div className="w-full content-center items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="flex w-full gap-7 py-2">
            <div className="flex w-full flex-col  gap-7 py-2">
              <label className="font-semibold">Password</label>

              <input
                name="password"
                type="password"
                className="border-b"
                onChange={(event) => {
                  setValue("password", event.currentTarget.value)
                  setPassword(event.currentTarget.value)
                }}
              />
              <PasswordChecker password={watch().password} />

              <label className="font-semibold">Confirm Password</label>
              <input
                name="confirmpassword"
                type="password"
                className="border-b"
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              {passIncorrect && (
                <div>
                  <p>Incorrect Password.</p>
                </div>
              )}
            </div>

            <hr className="w-full"></hr>
          </div>
          <button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Change"}
          </button>
          <button
            type="button"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            onClick={() => console.log(error)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Change"}
          </button>
        </form>

        {error && (
          <div className="text-wrap mt-2 font-sans text-sm italic text-red-500">
            {error}
          </div>
        )}
        <Modal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          className="max-w-2xl"
          title="Change Pass Complete"
        >
          <div className="flex w-full flex-col px-4 py-2">
            <div>
              <p className="text-center text-lg font-semibold">
                Change password successfully.
              </p>
            </div>
            <div className="flex justify-end py-2">
              <button
                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => {
                  setIsVisible(false)
                  props.setVisibile(false)
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Modal>
  )
}
