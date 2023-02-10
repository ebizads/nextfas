import { useForm } from "react-hook-form"
import { z } from "zod/lib"
import { ChangeUserPass } from "../../server/schemas/user"
import { zodResolver } from "@hookform/resolvers/zod"
import InputField from "../../components/atoms/forms/InputField"
import { trpc } from "../../utils/trpc"
import { Textarea } from "@mantine/core"
import { useEffect, useRef, useState } from "react"
import PasswordChecker from "../../components/atoms/forms/PasswordChecker"
import Modal from "../../components/headless/modal/modal"
import { clearAndGoBack, passConfirmCheck } from "../../lib/functions"
import { useSession } from "next-auth/react"
import { Session } from "inspector"
// import bcrypt from "bcrypt"

// import { useSession } from "next-auth/react"

type ChangePass = z.infer<typeof ChangeUserPass>

export const ChangePassModal = (props: {
  isVisible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [passIncorrect, setPassIncorrect] = useState<boolean>(false)
  const [confirmPass, setConfirmPass] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [changeString, setChangeString] = useState<string>("")
  const [userId, setUserId] = useState<number>(0)
  const [dataCheck, setDataCheck] = useState<boolean>(true)
  const [changePassSuccess, setChangePassSuccess] = useState<boolean>(false)
  const [prompterString, setPrompterString] = useState<string | null>(null)
  const { data: session } = useSession()
  const { data: user, refetch } = trpc.user.findOne.useQuery(userId)

  const clearAndClose = () => {
    setPassword("")
    setConfirmPassword("")

    const form = document.getElementById("1") as HTMLFormElement
    if (form) {
      form.reset()
    }

    console.log("pass: " + password)
    setPassIncorrect(false)
    props.setVisible(false)
  }

  const dateNow = new Date()
  let dayNow = 0
  if (Boolean(user?.passwordAge)) {
    dayNow = Number(
      (dateNow.getTime() - (user?.passwordAge?.getTime() ?? 0)) /
        (1000 * 60 * 60 * 24)
    )
  }

  const { mutate } = trpc.user.change.useMutation({
    onSuccess(data) {
      setIsVisible(true)
      //console.log(data)
      if (data !== false) {
        setChangeString("Change Password Succesfully")
        setDataCheck(true)

        //window.location.reload();
      } else {
        setChangeString(
          "The password has already been used, please choose a different one."
        ) //todo
        setDataCheck(false)
      }
      setChangePassSuccess(true), refetch()
      // invalidate query of asset id when mutations is successful
    },
    onError() {
      console.log(error), refetch()
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
    },
  })

  useEffect(() => {
    if (user?.firstLogin) {
      setPrompterString(
        "Current password is only one-time use, change your password immediately."
      )
    } else if (dayNow > 60) {
      setPrompterString(
        "Password age exceeds 60 days, change your password immediately."
      )
    }

    setUserId(Number(session?.user?.id))
    setConfirmPass(passConfirmCheck(password, confirmPassword))
    if (!confirmPass && confirmPassword.length !== 0) {
      setPassIncorrect(true)
    } else {
      setPassIncorrect(false)
    }

    console.log("isVisible: " + props.isVisible)

    // if (!props.isVisible && session?.user?.firstLogin ) {
    //   props.setVisible(true)
    //   props.setPromptVisible(true)
    // }

    if (dataCheck) {
      if (user?.firstLogin) {
        props.setVisible(true)
        console.log("setvisible111: " + props.isVisible)
      }
    }

    // const intervalId = setInterval(() => {
    //   refetch();
    //   console.log("userId: " + userId)
    // }, 1000);
    // console.log(confirmPass)
    // clearInterval(intervalId);
  }, [
    user,
    session,
    confirmPass,
    confirmPassword,
    password,
    changePassSuccess,
    props,

    dataCheck,
    refetch,
    userId,
    setPrompterString,
    dayNow,
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
        passwordAge: new Date(),
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
      className="max-w-xl"
      title="Change Password"
    >
      <div className="w-full content-center items-center justify-center">
        {(user?.firstLogin || dayNow > 60) && (
          <div>
            <p className="text-center text-lg font-semibold">
              {prompterString}
            </p>
          </div>
        )}
        <form
          id="1"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          {/* <div className="flex w-full gap-7 py-2"> */}
          <div className="my-5 flex w-full flex-col gap-4 py-2">
            <label className="font-semibold">Password</label>

            <input
              name="password"
              type="password"
              className="w-full rounded-md border-2 border-gray-400  p-1  outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
              onChange={(event) => {
                setValue("password", event.currentTarget.value)
                setPassword(event.currentTarget.value)
              }}
            />
            {password && <PasswordChecker password={watch().password} />}

            <label className="font-semibold">Confirm Password</label>
            <input
              name="confirmpassword"
              type="password"
              className="w-full rounded-md border-2 border-gray-400 p-1  outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2"
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {passIncorrect && (
              <div>
                <p>Password not match.</p>
              </div>
            )}
          </div>

          <hr className="w-full"></hr>
          {/* </div> */}
          <div className="mt-2 flex w-full justify-end gap-2 text-lg">
            <button
              type="button"
              className="px-4 py-2 underline"
              onClick={() => clearAndClose()}
            >
              Discard
            </button>
            <button
              type="submit"
              className="rounded-md bg-tangerine-300  px-6 py-2 font-medium text-dark-primary outline-none hover:bg-tangerine-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-tangerine-200"
              onClick={() => console.log(errors)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Change"}
            </button>
          </div>
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
                  if (dataCheck == true) {
                    props.setVisible(false)
                    setIsVisible(false)
                  }
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
