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
import { Session } from "inspector"
// import bcrypt from "bcrypt"

// import { useSession } from "next-auth/react"

type ChangePass = z.infer<typeof ChangeUserPass>

export const ChangePassModal = (props: {
  isVisible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  promptVisible: boolean
  setPromptVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [passIncorrect, setPassIncorrect] = useState<boolean>(false)
  const [confirmPass, setConfirmPass] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [changeString, setChangeString] = useState<string>("")
  const [userId, setUserId] = useState<number>(0)
  const [dataCheck, setDataCheck] = useState<boolean>(true)
  const [changePassSuccess, setChangePassSuccess] = useState<boolean>(false)
  const [promptCounter, setPromptCounter] = useState<boolean>(true)
  const { data: session } = useSession()
  const { data: user } = trpc.user.findOne.useQuery(userId)

  const { mutate } = trpc.user.change.useMutation({
    onSuccess(data) {
      setIsVisible(true)
      //console.log(data)
      if (data !== false) {
        setChangeString("Change Password Succesfully")
        setDataCheck(true)
        window.location.reload();
      } else {
        setChangeString(
          "The password has already been used, please choose a different one."
        ) //todo
        setDataCheck(false)
      }
      setChangePassSuccess(true)
      // invalidate query of asset id when mutations is successful
    },
    onError() {
      console.log(error)
    },
  })

  const userData = trpc.user.findOne.useQuery(userId ?? 0)

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
      firstLogin: false,
      password: "",
      id: userId ?? 0,
      passwordAge: 1,
    },
  })

  useEffect(() => {

    
    setUserId(Number(session?.user?.id))
    setConfirmPass(passConfirmCheck(password, confirmPassword))
    if (!confirmPass && confirmPassword.length !== 0) {
      setPassIncorrect(true)
    } else {
      setPassIncorrect(false)
    }

    console.log("Propmpter: " + props.promptVisible)

    console.log("isVisible: " + props.isVisible)

    // if (!props.isVisible && session?.user?.firstLogin ) {
    //   props.setVisible(true)
    //   props.setPromptVisible(true)
    // }

    if (dataCheck) {
      if (user?.firstLogin) {
        props.setVisible(true)
        console.log("setvisible111: " + props.isVisible)
        props.setPromptVisible(true)
      }
    }

    console.log(confirmPass)
  }, [
    user,
    session,
    confirmPass,
    confirmPassword,
    password,
    changePassSuccess,
    props,
    promptCounter,
    dataCheck
  ])
  // const encryptPass = async () =>{
  //   const match = await bcrypt.compare(password, "$2b$10$Yc8Z.neAGmNltMqoM36eG.kI9TpoUPAMljttwI5niA2nNjaKClIim")
  //   console.log(match.toString())
  // }

  const onSubmit = (changeUserPass: ChangePass) => {
    // console.log(confirmPass)
    //console.log("pass:" + password + " confirmPass: "+ confirmPassword)

    if (confirmPass) {
      mutate({
        ...changeUserPass,
        oldPassword: userData.data?.oldPassword ?? [],
        password: changeUserPass.password,
        id: userId,
      })
      reset()
    } else {
      console.log(error)
    }
  }

  return (
    <Modal
      isVisible={props.isVisible}
      setIsVisible={props.setVisible}
      className="max-w-4xl"
      title="Change Password"
    >
      <div className="w-full content-center items-center justify-center">
        {Boolean(props.promptVisible) && (
          <div>
            <p className="text-center text-lg font-semibold">
              Current password is only one-time use, change your password
              immediately.
            </p>
          </div>
        )}
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
                  <p>Password not match.</p>
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
            onClick={() => console.log(errors)}
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
          title="Status"
        >
          <div className="flex w-full flex-col px-4 py-2">
            <div>
              <p className="text-center text-lg font-semibold">
                {changeString}
              </p>
            </div>
            <div className="flex justify-end py-2">
              <button
                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => {
                  setIsVisible(false)
                  if (dataCheck !== false) {
                    setIsVisible(false)
                    props.setPromptVisible(false)
                  }
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
        {/* <Modal
          isVisible={props.promptVisible}
          setIsVisible={props.setPromptVisible}
          className="max-w-2xl"
          title="Change One Time Pass!"
        >
          <div className="flex w-full flex-col px-4 py-2">
            <div>
              <p className="text-center text-lg font-semibold">
                Password is only one-time use, change your password immediately.
              </p>
            </div>
            <div className="flex justify-end py-2">
              <button
                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => {
                  props.setPromptVisible(false)
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal> */}
      </div>
    </Modal>
  )
}
