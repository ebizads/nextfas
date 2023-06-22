import { Accordion } from "@mantine/core"
import { Employee } from "@prisma/client"
import { trpc } from "../../../utils/trpc"
import { ExcelExportType } from "../../../types/employee"
import { useState } from "react"
import { MouseEventHandler } from "react"

const DuplicateAccordion = (props: {
  currentRecords: Employee[]
  incomingChanges: unknown[]
}) => {
  const [employeeId, setEmployeeId] = useState<number>(-1)
  const [employeesMutate, setEmployeesMutate] = useState<ExcelExportType[]>([])

  const {
    mutate,
    isLoading: employeeLoading,
    error,
  } = trpc.employee.edit.useMutation({
    onSuccess() {
      console.log("singol change")
      props.incomingChanges.splice(employeeId, 1)
      props.currentRecords.splice(employeeId,1)        // invalidate query of asset id when mutations is successful
    },
  })

  const retainRecord = (id: number) => () => {
    console.log("INITIAL INCOMING CHANGES: " + props.incomingChanges.length)
    props.incomingChanges.splice(id, 1)
    props.currentRecords.splice(id,1)
    console.log(
      "INCOMING CHANGES: " + props.incomingChanges.length,
    )
  }

  const acceptChange = (id: number) => () => {
    
    setEmployeeId(id)

    const final_singleEmployee = [] as ExcelExportType[]

    const singleEmployee = () => {
      return props.incomingChanges[id]
    }
    singleEmployee.apply((emp: (string | number | boolean | null)[]) => {
      const data_structure = {
        id: (emp as (string | number | null)[])[0] as number,
        name: (emp as (string | number | null)[])[1] as string,
        hired_date: new Date(
          (emp as (string | number | null | boolean)[])[2] as string
        ),
        position: (emp as (string | number | null)[])[3] as string,
        employee_id: (emp as (string | number | null)[])[4] as string,
        email: (emp as (string | number | null)[])[5] as string,
        teamId: (emp as (number | null)[])[6] as number,
        superviseeId: (emp as (number | null)[])[7] as number,
        createdAt: new Date((emp as (string | number | null)[])[8] as string),
        updatedAt: new Date((emp as (string | number | null)[])[9] as string),
        deleted: (emp as (string | number | null | boolean)[])[10] as boolean,
        deletedAt: new Date(
          (emp as (string | number | null | boolean)[])[11] as string
        ),
        workMode: (emp as (string | null)[])[12] as string,
        workStation: (emp as (string | null)[])[13] as string,
        address: {
          id: (emp as (string | number | null)[])[15] as number,
          street: (emp as (string | number | null)[])[16] as string,
          city: (emp as (string | number | null)[])[17] as string,
          state: (emp as (string | number | null)[])[18] as string,
          zip: (emp as (string | number | null)[])[19] as string,
          country: (emp as (string | number | null)[])[20] as string,
          createdAt:
            new Date(
              (emp as (string | number | null | boolean)[])[21] as string
            ) ?? null,
          updatedAt:
            new Date(
              (emp as (string | number | null | boolean)[])[22] as string
            ) ?? null,
          //may laktaw po ito
          deleted: (emp as (string | number | null | boolean)[])[25] as boolean,
          deletedAt: new Date(
            (emp as (string | number | null | boolean)[])[24] as string
          ),
          userId: (emp as (string | number | null)[])[21] as number,
          companyId: (emp as (number | string | null)[])[22] as number,
          vendorId: (emp as (string | number | null)[])[23] as number,
          employeeId: (emp as (string | number | null)[])[24] as number,
        },
        profile: {
          id: (emp as (string | number | null)[])[27] as number,
          first_name: (emp as (string | number)[])[28] as string,
          middle_name: (emp as (string | number | null)[])[29] as string,
          last_name: (emp as (string | number)[])[30] as string,
          suffix: (emp as (string | number | null)[])[31] as string,
          gender: (emp as (string | number | null)[])[32] as string,
          image: (emp as (string | number | null)[])[33] as string,
          date_of_birth: new Date(
            (emp as (string | number | null | boolean)[])[34] as string
          ),
          userId: (emp as (string | number | null)[])[37] as number,
          employeeId: (emp as (string | number | null)[])[36] as number,
          phone_no: (emp as (string | number | null)[])[35] as string,
        },
      } as ExcelExportType
      final_singleEmployee.push(data_structure)
    })

    setEmployeesMutate(final_singleEmployee)
    console.log("EMPLOYEEE" + JSON.stringify(singleEmployee()))

    try {
      mutate({
        id: employeesMutate[0]?.id ?? 0,
        name: employeesMutate[0]?.name ?? "",
        hired_date: employeesMutate[0]?.hired_date,
        position: employeesMutate[0]?.position,
        employee_id: employeesMutate[0]?.employee_id,
        email: employeesMutate[0]?.email,
        teamId: employeesMutate[0]?.teamId ?? 0,
        superviseeId: employeesMutate[0]?.superviseeId ?? 0,
        // createdAt: employeesMutate[0]?.createdAt,
        // updatedAt: employeesMutate[0]?.updatedAt,
        // deleted: employeesMutate[0]?.deleted,
        // deletedAt: employeesMutate[0]?.deletedAt,
        workMode: employeesMutate[0]?.workMode,
        workStation: employeesMutate[0]?.workStation,
        address: {
          // id: employeesMutate[0]?.address?.id ?? 0,
          street: employeesMutate[0]?.address?.street,
          city: employeesMutate[0]?.address?.city,
          state: employeesMutate[0]?.address?.state,
          zip: employeesMutate[0]?.address?.state,
          country: employeesMutate[0]?.address?.country,
          // createdAt: employeesMutate[0]?.address?.createdAt,
          // updatedAt: employeesMutate[0]?.address?.updatedAt,
          //may laktaw po ito
          // deleted: employeesMutate[0]?.address?.deleted,
          // deletedAt: employeesMutate[0]?.address?.deletedAt,
          // userId: employeesMutate[0]?.address?.userId ?? 0,
          // companyId: employeesMutate[0]?.address?.companyId,
          // vendorId: employeesMutate[0]?.address?.vendorId,
          // employeeId: employeesMutate[0]?.address?.employeeId,
        },
        profile: {
          // id: employeesMutate[0]?.profile?.id,
          first_name: employeesMutate[0]?.profile?.first_name ?? "",
          
          middle_name: employeesMutate[0]?.profile?.middle_name,
          last_name: employeesMutate[0]?.profile?.last_name ?? "",
          suffix: employeesMutate[0]?.profile?.suffix,
          gender: employeesMutate[0]?.profile?.gender,
          image: employeesMutate[0]?.profile?.image,
          date_of_birth: employeesMutate[0]?.profile?.date_of_birth,
          // userId: employeesMutate[0]?.profile?.userId,
          // employeeId: employeesMutate[0]?.profile?.employeeId,
          phone_no: employeesMutate[0]?.profile?.phone_no,
        },
      })
    } catch {}
  }

  return (
    
      <Accordion>
        {props.currentRecords.map((employee, idx) => (
          <Accordion.Item value={employee.id.toString()} key={idx}>
            <Accordion.Control className="uppercase">
              <div className="grid w-1/2 grid-cols-2 gap-1">
                <p>{employee.employee_id}</p>
                <p>{employee.name}</p>
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-light-secondary">
                      Current Record
                    </p>
                    <pre className="text-sm">
                      {JSON.stringify(employee, null, 2)}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-1 border-l-2 border-tangerine-500 px-4">
                    <p className="text-sm text-light-secondary">
                      Incoming Change
                    </p>
                    <pre className="text-sm">
                      {props.incomingChanges ? (
                        JSON.stringify(props.incomingChanges[idx], null, 2)
                      ) : (
                        <></>
                      )}
                    </pre>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    className="px-2 hover:underline"
                    onClick={retainRecord(idx)}
                  >
                    Retain Record
                  </button>
                  <button
                    className="border-l-2 border-tangerine-600 px-2 text-tangerine-500 hover:underline"
                    onClick={acceptChange(idx)}
                  >
                    Accept Incoming Change
                  </button>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    
  )
}

export default DuplicateAccordion
