import React, { useEffect, useMemo, useState } from "react"
import { env } from "../../env/client.mjs"
import { trpc } from "../../utils/trpc"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { EditUserInput } from "../../server/schemas/user"
import { generateCertificate } from "../../lib/functions"
import Modal from "../headless/modal/modal"
import { SelectValueType } from "../atoms/select/TypeSelect"
import { Select } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
export type User = z.infer<typeof EditUserInput>

export const UserValidateModal = (props: {
  openModalDesc: boolean
  setOpenModalDesc: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  // useEffect(() => {
  //   console.log(props.asset.addedBy)
  // }, [])

  // const componentRef = useRef(null);

  // const { selectedAsset, setSelectedAsset } = useUpdateAssetStore()
  // const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [date, setDate] = useState<Date>(new Date())
  const [certificateCheck, setCertificate] = useState<string>("")
  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [userId, setUserId] = useState<number>(0)
  const { data: session } = useSession()
  const { data: user } = trpc.user.findOne.useQuery(userId)
  const { data: teams } = trpc.team.findOne.useQuery(user?.teamId ?? 0)
  const { data: allTeams } = trpc.team.findAll.useQuery()
  const [searchValue, onSearchChange] = useState<string>(
    user?.teamId?.toString() ?? "0"
  )
  const futureDate = new Date()

  futureDate.setFullYear(futureDate.getFullYear() + 1)

  const teamList = useMemo(() => {
    const list = allTeams?.teams.map(
      (team: { id: { toString: () => any }; name: any }) => {
        return { value: team.id.toString(), label: team.name }
      }
    ) as SelectValueType[]
    return list ?? []
  }, [allTeams]) as SelectValueType[]

  useEffect(() => {
    setUserId(Number(session?.user?.id))
    setCertificate(generateCertificate())
  }, [session?.user?.id])

  const {
    mutate,
    isLoading: isLoading,
    error,
  } = trpc.user.update.useMutation({
    onSuccess() {
      setCompleteModal(true)

      // invalidate query of asset id when mutations is successful
    },
  })
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(EditUserInput),
  })

  const onSubmit = async (user: User) => {
    // Register function
    mutate({
      ...user,
      name: `${user.profile.first_name} ${user.profile.last_name}`,
      teamId: user.teamId,
      hired_date: new Date(),
      position: user.position,
      profile: {
        first_name: user.profile.first_name,
        middle_name: user.profile.middle_name,
        last_name: user.profile.last_name,
        // image: images[0]?.file ?? "",
      },
      email: user.email,
      address: {
        city: user.address?.city,
        country: user.address?.country,
        street: user.address?.street,
        zip: user.address?.zip,
      },
      inactivityDate: new Date(),
      passwordAge: new Date(),
      validateTable: {
        certificate: certificateCheck,
        validationDate: futureDate,
      },
    })
    reset()
  }
  return (
    <Modal
      isVisible={props.openModalDesc}
      setIsVisible={props.setOpenModalDesc}
      className="max-w-4xl"
      title="User Details"
    >
      <div>
        <div className="flex w-full flex-row-reverse">
          <div className="flex items-center space-x-1 align-middle ">
            <p className="text-xs uppercase text-gray-500">edit form </p>
            <i
              className="fa-light fa-pen-to-square cursor-pointer"
              onClick={() => {
                if (!isEditable) {
                  setIsEditable(true)
                } else if (isEditable) {
                  setIsEditable(false)
                }
              }}
            />
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
          noValidate
        >
          <main className="container mx-auto flex flex-col justify-center p-4">
            <div className="flex w-full flex-wrap gap-4 py-2.5">
              <div className="flex w-[32%] flex-col">
                <label className="sm:text-sm">First Name</label>
                <input
                  className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                  name="profile.first_name"
                  type={"text"}
                  placeholder={user?.profile?.first_name ?? ""}
                  disabled={!isEditable}
                />
              </div>
              <div className="flex w-[32%] flex-col">
                <label className="sm:text-sm">Middle Name (Optional)</label>
                <input
                  type={"text"}
                  name={"profile.middle_name"}
                  value={user?.profile?.middle_name ?? ""}
                  className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                  disabled={!isEditable}
                />
              </div>
              <div className="flex w-[32%] flex-col">
                <label className="sm:text-sm">Last Name</label>
                <input
                  className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                  type={"text"}
                  name={"profile.last_name"}
                  value={user?.profile?.last_name ?? ""}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-2.5">
              <div className="flex w-[32%] flex-col">
                <label className="sm:text-sm">Team</label>
                <Select
                  disabled={!isEditable}
                  placeholder={teams?.name?.toString() ?? "Pick One"}
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
              </div>
              <div className="flex w-[32%] flex-col">
                <label className="sm:text-sm">User Number</label>
                <p className="w-full rounded-md border-2 border-gray-400 bg-transparent bg-gray-200 px-4  py-2  text-gray-400 outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 ">
                  {`${env.NEXT_PUBLIC_CLIENT_USER_ID}`}
                  {userId}
                </p>
              </div>
              <div className="flex w-[32%] flex-col">
                <label className="sm:text-sm">Designation / Position</label>
                <input
                  className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                  value={user?.position ?? ""}
                  type={"text"}
                  name={"position"}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-2.5">
              <div className="flex w-[49%] flex-col">
                <label className="sm:text-sm">Email</label>
                <input
                  className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                  disabled={!isEditable}
                  type={"text"}
                  name={"email"}
                  placeholder={user?.email}
                />
              </div>
              <div className="flex w-[49%] flex-col">
                <label className="sm:text-sm">Departmemt</label>

                <p className="w-full rounded-md border-2 border-gray-400 bg-transparent bg-gray-200 px-4  py-2  text-gray-400 outline-none ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 ">
                  {"--"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-2.5">
              <div className="flex flex-col sm:w-1/3 md:w-[49%]">
                <label className="sm:text-sm ">Hired Date</label>
                <DatePicker
                  disabled={!isEditable}
                  dropdownType="modal"
                  placeholder={user?.hired_date?.getDate.toString()}
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
                  className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                  disabled={!isEditable}
                  type="number"
                  name="mobile_number"
                  placeholder={user?.profile?.phone_no ?? "-"}
                />
              </div>
              <div className="flex w-full flex-wrap gap-4 py-2.5">
                <div className="flex w-[18.4%] flex-col">
                  <label className="sm:text-sm">Street</label>
                  <input
                    className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                    disabled={!isEditable}
                    type={"text"}
                    name={"address.street"}
                    placeholder={user?.address?.street ?? "-"}
                  />
                </div>
                <div className="flex w-[18.4%] flex-col">
                  <label className="sm:text-sm">Barangay</label>
                  <input
                    className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                    disabled={!isEditable}
                    type={"text"}
                    name={"address.state"}
                    placeholder={user?.address?.state ?? "-"}
                  />
                </div>
                <div className="flex w-[18.4%] flex-col">
                  <label className="sm:text-sm">City</label>
                  <input
                    className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                    disabled={!isEditable}
                    type={"text"}
                    name={"address.city"}
                    placeholder={user?.address?.city ?? "-"}
                  />
                </div>
                <div className="flex w-[18.4%] flex-col">
                  <label className="sm:text-sm">Zip Code</label>
                  <input
                    className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                    disabled={!isEditable}
                    type={"text"}
                    name={"address.zip"}
                    placeholder={user?.address?.zip ?? "-"}
                  />
                </div>
                <div className="flex w-[18.4%] flex-col">
                  <label className="sm:text-sm">Country</label>
                  <input
                    className="w-full rounded-md border-2 border-gray-400 bg-transparent px-4 py-2 text-gray-600 outline-none  ring-tangerine-400/40 placeholder:text-sm focus:border-tangerine-400 focus:outline-none focus:ring-2 disabled:bg-gray-200 disabled:text-gray-400 "
                    disabled={!isEditable}
                    type={"text"}
                    name={"address.country"}
                    placeholder={user?.address?.country ?? "-"}
                  />
                </div>
              </div>
            </div>

            <Modal
              isVisible={completeModal}
              setIsVisible={setCompleteModal}
              className="max-w-2xl"
              title="Updated User Account"
            >
              <div className="flex w-full flex-col px-4 py-2">
                <div>
                  <p className="text-center text-lg font-semibold">
                    User validated and updated successfully.
                  </p>
                </div>
                <button
                  className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={() => {
                    setCompleteModal(false)
                    setCertificate(generateCertificate())
                  }}
                >
                  Close
                </button>
              </div>
            </Modal>
          </main>
          <button
            type="submit"
            className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={isLoading}
            onClick={()=> console.log("ewan")}
          >
            {isLoading ? "Loading..." : "Save"}
          </button>
        </form>
      </div>
    </Modal>
  )
}
