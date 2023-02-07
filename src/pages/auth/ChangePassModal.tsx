import { useForm } from "react-hook-form"
import { z } from "zod/lib"
import { ChangeUserPass } from "../../server/schemas/user"
import { zodResolver } from "@hookform/resolvers/zod"
import InputField from "../../components/atoms/forms/InputField"
import { trpc } from "../../utils/trpc"
import { Textarea } from "@mantine/core"
import { useState } from "react"
import PasswordChecker from "../../components/atoms/forms/PasswordChecker"
import Modal from "../../components/headless/modal/modal"
import { passConfirmCheck } from "../../lib/functions"

type ChangePass = z.infer<typeof ChangeUserPass>

export const ChangePassModal = (props: {
  isVisible: any
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [passIncorrect, setPassIncorrect] = useState<boolean>(false)
  const [confirmPass, setConfirmPass] = useState<boolean>(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { mutate } = trpc.user.change.useMutation({
    onSuccess() {
      setIsVisible(true)
      // invalidate query of asset id when mutations is successful
    },
  })

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ChangePass>({
      resolver: zodResolver(ChangeUserPass),
      defaultValues: {
        firstLogin: false,
      },
    })

  const onSubmit = (changeUserPass: ChangePass) => {
    setConfirmPass(passConfirmCheck(password, confirmPassword))
    if (confirmPass) {
        
      mutate({
        ...changeUserPass,
        oldPassword: changeUserPass.oldPassword,
        password: changeUserPass.password,
        passwordAge: new Date(),
      })
      reset()
    } else setPassIncorrect(true)
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div className="">
          <div className="flex w-full flex-row justify-between gap-7 py-2">
            <div className="flex w-full flex-row justify-between gap-7 py-2">
              <label className="font-semibold">Password</label>

              <input
                name="password"
                type="password"
                className="border-b"
                onChange={(event) => setPassword(event.target.value)}
              />
              <PasswordChecker password={watch().password} />

              <label className="font-semibold">Confirm Password</label>
              <input
                name="confirmpassword"
                type="confirmpassword"
                className="border-b"
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
            {passIncorrect && (
              <div>
                <p>Incorrect Password.</p>
              </div>
            )}
            <hr className="w-full"></hr>
          </div>
        </div>
      </form>

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
                props.setCloseModal(false)
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
