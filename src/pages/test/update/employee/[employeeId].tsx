import { z } from "zod"
import { EmployeeEditInput } from "../../../../server/common/input-types"
import React, { useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import { trpc } from "../../../../utils/trpc"
import _ from "lodash"
import Head from "next/head"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { address, profile } from "@prisma/client"
import { InputField } from "../../../../components/atoms/forms/InputField"
import AlertInput from "../../../../components/atoms/forms/AlertInput"

type Employee = z.infer<typeof EmployeeEditInput>

const EmployeeEdit = () => {
  const { employeeId } = useRouter().query

  const { data: employee } = trpc.employee.findOne.useQuery(
    Number(employeeId),
    {
      //  only fetch when employeeId is not undefined or null
      enabled: !!employeeId,
    }
  )

  // remove null values on asset data
  const editEmployee = useMemo(() => {
    if (employee) {
      return _.pickBy(employee)
    }
  }, [employee])

  return (
    <>
      <Head>
        <title>FAS Server</title>
        <meta name="description" content="Fixed Asset System server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h3 className="mb-2 text-xl font-bold leading-normal text-gray-700 md:text-[2rem]">
          Update Employee - {employee?.name}
        </h3>
        <EditForm employee={editEmployee} />
        <Link href="/auth/login">
          <a className="my-2 px-4 py-1 text-amber-300 underline hover:text-amber-400">
            Login
          </a>
        </Link>
      </main>
    </>
  )
}

export default EmployeeEdit

const EditForm = ({
  employee,
}: {
  employee:
    | _.Dictionary<string | number | boolean | address | profile | Date | null>
    | undefined
}) => {
  // use utils from use context
  const utils = trpc.useContext()
  const { mutate, isLoading, error } = trpc.employee.edit.useMutation({
    onSuccess() {
      // invalidate query of asset id when mutations is successful
      utils.employee.findOne.invalidate(Number(employee?.id))
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Employee>({
    resolver: zodResolver(EmployeeEditInput),
    defaultValues: useMemo(
      () => ({ ...employee, id: Number(employee?.id) }),
      [employee]
    ),
  })

  useEffect(() => reset(employee), [employee, reset])

  const onSubmit = async (employee: Employee) => {
    // Register function
    mutate({
      ...employee,
      name: `${employee.profile?.first_name} ${employee.profile?.last_name}`,
    })
    reset()
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
        noValidate
      >
        <InputField
          register={register}
          label="Employee ID"
          name="employee_id"
          className="border-b"
        />
        <AlertInput>{errors?.employee_id?.message}</AlertInput>

        <InputField
          register={register}
          label="First Name"
          name="profile.first_name"
          className="border-b"
        />
        <AlertInput>{errors?.profile?.first_name?.message}</AlertInput>

        <InputField
          register={register}
          label="Last Name"
          name="profile.last_name"
          className="border-b"
        />
        <AlertInput>{errors?.profile?.last_name?.message}</AlertInput>

        <InputField
          register={register}
          label="Email"
          name="email"
          className="border-b"
        />
        <AlertInput>{errors?.profile?.last_name?.message}</AlertInput>

        <button
          type="submit"
          className="rounded bg-tangerine-500 px-4 py-1 font-medium text-white duration-150 hover:bg-tangerine-400 disabled:bg-gray-300 disabled:text-gray-500"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Register"}
        </button>
      </form>
      {error && (
        <pre className="mt-2 text-sm italic text-red-500">
          Something went wrong!
          {JSON.stringify(error, null, 2)}
        </pre>
      )}
    </>
  )
}
