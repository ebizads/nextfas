import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@mantine/dates"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
//import { ImageJSON } from "../../types/table"
import { trpc } from "../../utils/trpc"
import AlertInput from "../atoms/forms/AlertInput"
import { InputField } from "../atoms/forms/InputField"
import { Select } from "@mantine/core"
//import DropZoneComponent from "../dropzone/DropZoneComponent"
import { ImageJSON } from "../../types/table"
import DropZoneComponent from "../dropzone/DropZoneComponent"
import { SelectValueType } from "../atoms/select/TypeSelect"
import { UserType } from "../../types/generic"
import { useEditableStore } from "../../store/useStore"
// import { useEditableStore } from "../../store/useStore"
import { CreateArchiveUser, EditUserInput } from "../../server/schemas/user"
import { generateCertificate } from "../../lib/functions"
import Modal from "../headless/modal/modal"
import { stubFalse } from "lodash"

export type User = z.infer<typeof EditUserInput>

const UpdateUserModal = (props: {
  user: UserType
  // setImage: React.Dispatch<React.SetStateAction<ImageJSON[]>>
  // images: ImageJSON[]
  // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  // isLoading: boolean
  // setEditable: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [searchValue, onSearchChange] = useState<string>(
    props.user?.user_Id?.toString() ?? "0"
  )
  const futureDate = new Date()
  const [openModalDel, setOpenModalDel] = useState<boolean>(false)
  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [certificateCheck, setCertificate] = useState<string>("")
  const [date, setDate] = useState(props.user?.hired_date ?? new Date())
  const utils = trpc.useContext()
  const [images, setImage] = useState<ImageJSON[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { data: teams } = trpc.team.findAll.useQuery()
  const { editable, setEditable } = useEditableStore()

  const { data: user } = trpc.user.findOne.useQuery(
    Number(props.user?.id) ?? 0
  )
  const { data: singleTeams } = trpc.team.findOne.useQuery(
    props.user?.teamId ?? 0
  )

  const lockedChecker =
    futureDate < (props.user?.lockedUntil ?? "") ? true : false

  const teamList = useMemo(() => {
    const list = teams?.teams.map(
      (team: { id: { toString: () => any }; name: any }) => {
        return { value: team.id.toString(), label: team.name }
      }
    ) as SelectValueType[]
    return list ?? []
  }, [teams]) as SelectValueType[]

  const {
    mutate,
    isLoading: userLoading,
    error,
  } = trpc.user.updateAdmin.useMutation({
    onSuccess() {
      console.log("omsim")
      setCompleteModal(true)
      utils.user.findAll.invalidate()
      setImage([])
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(EditUserInput),
  })

  useEffect(() => {
    console.log(("test") + JSON.stringify(user))
    reset(props.user as User)
    setCertificate(generateCertificate)
  }, [props.user, reset, user])

  const onSubmit = async (userForm: User) => {
    // Register function
    console.log(userForm)

    mutate({
      ...userForm,
      name: `${userForm.profile?.first_name
        ? userForm.profile?.first_name
        : user?.profile?.first_name
        } ${userForm.profile?.last_name
          ? userForm.profile?.last_name
          : user?.profile?.last_name
        }`,
      inactivityDate: new Date(),
      lockedAt: null,
      lockedUntil: null,
      attemps: null,
      lockedReason: null,
      teamId: userForm.teamId,
      id: userForm.id,
      validateTable: {
        certificate: certificateCheck,
        validationDate: props.user?.validateTable?.validationDate ?? futureDate,
      },
    })
    reset()
  }

  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [updated, setUpdated] = useState(false)

  const handleDelete = () => {
    setOpenModalDel(true)
  }

  const handleEditable = () => {
    setIsEditable(true)
  }

  const handleIsEditable = () => {
    if (!updated) {
      setEditable(!editable)
      setUpdated(true)
    }
  }

  // useEffect(() => { console.log("department: " + props.employee?.team?.department?.name) })

  return (
    <div>
      <div className="flex w-full flex-row-reverse">
        <div className="flex items-center space-x-1 align-middle ">
          <p className="text-xs uppercase text-gray-500">edit form </p>
          <i
            className="fa-light fa-pen-to-square cursor-pointer"
            onClick={() => {
              handleIsEditable()
              handleEditable()
            }}
          />
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
        noValidate
      >
        <div className="flex w-full flex-wrap gap-4 py-2.5">
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">First Name</label>
            <InputField
              disabled={!isEditable}
              register={register}
              name="profile.first_name"
              type={"text"}
              label={""}
            />
            <AlertInput>{errors?.profile?.first_name?.message}</AlertInput>
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Middle Name (Optional)</label>
            <InputField
              // className="0 appearance-none  border border-black py-2 px-3 leading-tight text-gray-700 focus:outline-none"
              disabled={!isEditable}
              type={"text"}
              label={""}
              name={"profile.middle_name"}
              register={register}
            />
          </div>
          <div className="flex w-[32%] flex-col">
            <label className="sm:text-sm">Last Name</label>
            <InputField
              disabled={!isEditable}
              type={"text"}
              label={""}
              name={"profile.last_name"}
              register={register}
            />
            <AlertInput>{errors?.profile?.last_name?.message}</AlertInput>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-4 py-2.5">
          <div className="flex w-[24%] flex-col">
            <label className="sm:text-sm">Team</label>
            <Select
              disabled={!isEditable}
              placeholder={singleTeams?.name ? singleTeams?.name : "Pick One"}
              onChange={(value) => {
                setValue("teamId", Number(value) ?? 0)
                onSearchChange(value ?? "0")
              }}
              value={searchValue}
              data={teamList}
              styles={(theme) => ({
                item: {
                  // applies styles to selected item
                  "&[data-selected]": {
                    "&, &:hover": {
                      backgroundColor:
                        theme.colorScheme === "light"
                          ? theme.colors.orange[3]
                          : theme.colors.orange[1],
                      color:
                        theme.colorScheme === "dark"
                          ? theme.white
                          : theme.black,
                    },
                  },

                  // applies styles to hovered item (with mouse or keyboard)
                  "&[data-hovered]": {},
                },
              })}
              variant="unstyled"
              className={
                isEditable
                  ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 p-0.5 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            />
            {/* <AlertInput>{errors?.team?.name?.message}</AlertInput> */}
          </div>
          <div className="flex w-[23%] flex-col">
            <label className="sm:text-sm">User Number</label>
            {/* <InputField
               
              type={"text"}
              label={""}
              name={"employee_id"}
              register={register}
            /> */}
            <p
              className={
                "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            >{`${props.user?.user_Id}`}</p>
          </div>
          <div className="flex w-[23%] flex-col">
            <label className="sm:text-sm">Designation / Position</label>
            <InputField
              type={"text"}
              disabled={!isEditable}
              label={""}
              placeholder={props.user?.position?.toString()}
              name={"position"}
              register={register}
            />

            <AlertInput>{errors?.position?.message}</AlertInput>
          </div>
          <div className="flex w-[24%] flex-col">
            <label className="sm:text-sm">User Type</label>
            <Select
              disabled={!isEditable}
              placeholder={user?.user_type ? user?.user_type : "Pick One"}
              onChange={(value) => {
                setValue("user_type", String(value) ?? "")
              }}
              data={["user", "admin"]}
              styles={(theme) => ({
                item: {
                  // applies styles to selected item
                  "&[data-selected]": {
                    "&, &:hover": {
                      backgroundColor:
                        theme.colorScheme === "light"
                          ? theme.colors.orange[3]
                          : theme.colors.orange[1],
                      color:
                        theme.colorScheme === "dark"
                          ? theme.white
                          : theme.black,
                    },
                  },

                  // applies styles to hovered item (with mouse or keyboard)
                  "&[data-hovered]": {},
                },
              })}
              variant="unstyled"
              className={
                isEditable
                  ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 p-0.5 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            />
            {/* <AlertInput>{errors?.team?.name?.message}</AlertInput> */}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="flex w-[49%] flex-col">
            <label className="sm:text-sm">Email</label>
            <InputField
              disabled={!isEditable}
              type={"text"}
              label={""}
              name={"email"}
              register={register}
            />
            <AlertInput>{errors?.email?.message}</AlertInput>
          </div>
          <div className="flex w-[49%] flex-col">
            <label className="sm:text-sm">Departmemt</label>

            <p
              className={
                "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            >
              {props.user?.Userteam?.department?.name
                ? `${props.user?.Userteam?.department?.name}`
                : "--"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-2.5">
          <div className="flex flex-col sm:w-1/3 md:w-[49%]">
            <label className="sm:text-sm ">Hired Date</label>
            {/* <InputField
            className= appearance-none border  border-black py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-outline"
            type={"text"}
          /> */}
            <DatePicker
              disabled={!isEditable}
              dropdownType="modal"
              placeholder="Pick Date"
              size="sm"
              variant="unstyled"
              value={date}
              onChange={(value) => {
                setValue("hired_date", value)
                value === null ? setDate(new Date()) : setDate(value)
              }}
              className={
                isEditable
                  ? "my-2 w-full rounded-md border-2 border-gray-400 bg-transparent p-0.5 px-4 text-gray-600 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 p-0.5 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
            />
          </div>

          <div className="flex w-[49%] flex-col">
            <label className="mb-2 sm:text-sm">Mobile Number</label>
            <input
              disabled={!isEditable}
              type="number"
              pattern="[0-9]*"
              defaultValue={props.user?.profile?.phone_no ?? "--"}
              className={
                isEditable
                  ? "mt-2 w-full rounded-md border-2 border-gray-400 bg-transparent py-2 px-4  text-gray-800 placeholder-gray-600  outline-none ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
                  : "my-2 w-full rounded-md border-2 border-gray-400 bg-gray-200 py-2 px-4 text-gray-400 outline-none  ring-tangerine-400/40 focus:border-tangerine-400 focus:outline-none focus:ring-2 "
              }
              onKeyDown={(e) => {
                if (e.key === "e") {
                  e.preventDefault()
                }
              }}
              onChange={(event) => {
                if (event.target.value.length > 11) {
                  console.log("more than 11")
                  event.target.value = event.target.value.slice(0, 11)
                }
                setValue(
                  "profile.phone_no",
                  event.currentTarget.value.toString()
                )
              }}
            />

            <AlertInput>{errors?.profile?.phone_no?.message}</AlertInput>
          </div>
          <div className="flex w-full flex-wrap gap-4 py-2.5">
            <div className="flex w-[18.4%] flex-col">
              <label className="sm:text-sm">Street</label>
              <InputField
                type={"text"}
                label={""}
                name="address.street"
                register={register}
                disabled={!isEditable}
              />
            </div>
            <div className="flex w-[18.4%] flex-col">
              <label className="sm:text-sm">Barangay</label>
              <InputField
                type={"text"}
                label={""}
                name={"address.state"}
                disabled={!isEditable}
                register={register}
              />

              <AlertInput>{errors?.address?.state?.message}</AlertInput>
            </div>
            <div className="flex w-[18.4%] flex-col">
              <label className="sm:text-sm">City</label>
              <InputField
                type={"text"}
                label={""}
                name={"address.city"}
                disabled={!isEditable}
                register={register}
              />

              <AlertInput>{errors?.address?.city?.message}</AlertInput>
            </div>
            <div className="flex w-[18.4%] flex-col">
              <label className="sm:text-sm">Zip Code</label>
              <InputField
                type={"text"}
                label={""}
                name={"address.zip"}
                disabled={!isEditable}
                register={register}
              />
              <AlertInput>{errors?.address?.zip?.message}</AlertInput>
            </div>
            <div className="flex w-[18.4%] flex-col">
              <label className="sm:text-sm">Country</label>
              <InputField
                type={"text"}
                label={""}
                name={"address.country"}
                disabled={!isEditable}
                register={register}
              />

              <AlertInput>{errors?.address?.country?.message}</AlertInput>
            </div>
          </div>
        </div>

        <hr className="w-full"></hr>
        {/* <div className="flex w-full justify-end">
          {isEditable && <button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={employeeLoading}
          >
            {employeeLoading ? "Loading..." : "Save"}
          </button>}
        </div> */}
        <div className="flex w-full justify-between">
          {!(
            error &&
            errors && (
              <pre className="mt-2 text-sm italic text-red-500">
                Something went wrong!
              </pre>
            )
          ) ? (
            <div></div>
          ) : (
            error &&
            errors && (
              <pre className="mt-2 text-sm italic text-red-500">
                Something went wrong!
              </pre>
            )
          )}
          <Modal
            isVisible={completeModal}
            setIsVisible={setCompleteModal}
            className="max-w-2xl"
            title="Updated User Account"
          >
            <div className="flex w-full flex-col px-4 py-2">
              <div>
                <p className="text-center text-lg font-semibold">
                  User updated successfully.
                </p>
              </div>
              <div className="flex justify-end py-2">
                <button
                  className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={() => {
                    setCompleteModal(false)
                    props.setIsVisible(false)
                    setCertificate(generateCertificate())
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
          {isEditable && (
            <div className="space-x-1">
              <button
                type="button"
                className="rounded bg-red-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => {
                  handleDelete(), setIsLoading(true)
                }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Delete"}
              </button>

              <button
                type="submit"
                className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                disabled={userLoading}
              >
                {userLoading
                  ? "Loading..."
                  : lockedChecker
                    ? "Unlock and save "
                    : "Save"}
              </button>
            </div>
          )}
          <UserDeleteModal
            user={props.user}
            openModalDel={openModalDel}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setOpenModalDel={setOpenModalDel}
            setIsVisible={props.setIsVisible}
          />
        </div>
      </form>
      {/* {error && errors && (
        <pre className="mt-2 text-sm italic text-red-500">
          Something went wrong!
        </pre>
      )} */}
    </div>
  )
}
export default UpdateUserModal

export const UserDeleteModal = (props: {
  user: UserType
  openModalDel: boolean
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDel: React.Dispatch<React.SetStateAction<boolean>>
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  //trpc utils for delete
  const { mutate } = trpc.user.createArchive.useMutation({
    onSuccess() {
      console.log()
      props.setOpenModalDel(false)
      props.setIsLoading(false)
      props.setIsVisible(false)
      window.location.reload()
    },
  })
  const handleDelete = async () => {
    mutate({
      old_id: Number(props.user?.id),
    })
  }

  return (
    <Modal
      className="max-w-2xl"
      title="Delete User Account"
      isVisible={props.openModalDel}
      setIsVisible={props.setOpenModalDel}
    >
      <div className="m-4 flex flex-col ">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>You are about to permanently delete </div>
          <p className="text-neutral-500">
            <i className="fa-regular fa-circle-exclamation" /> This action is
            irrevokable, please carefully review the action.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              className="rounded-sm bg-gray-300 px-5 py-1 hover:bg-gray-400"
              onClick={() => {
                props.setOpenModalDel(false)
              }}
            >
              Cancel
            </button>
            <button
              className="rounded-sm bg-red-500 px-5 py-1 text-neutral-50 hover:bg-red-600"
              onClick={() => handleDelete()}
            // disabled={isLoading}
            >
              Yes, delete record
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
