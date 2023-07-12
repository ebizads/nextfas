import { Accordion } from "@mantine/core"
import { Employee } from "@prisma/client"
import { trpc } from "../../../utils/trpc"
import { ExcelExportType } from "../../../types/employee"
import { useState } from "react"
import { MouseEventHandler } from "react"

const DuplicateAccordion = (props: {
  currentRecords: Employee[]
  incomingChanges: ExcelExportType[]
}) => {
  const [employeeArray, setEmployeeArray] = useState<number[]>([])
  const [employeeId, setEmployeeId] = useState<number>(-1)
  const [spliceId, setSpliceId] = useState<number>(-1)
  const [employeesMutate, setEmployeesMutate] = useState<ExcelExportType[]>([])

  const {
    mutate,
    isLoading: employeeLoading,
    error,
  } = trpc.employee.edit.useMutation({
    onSuccess() {
      console.log("singol change")
      removeItem(employeeId)
      props.incomingChanges.splice(spliceId, 1)
      props.currentRecords.splice(spliceId, 1)        // invalidate query of asset id when mutations is successful
    },
  })


  const [mappedItems, setMappedItems] = useState(props.currentRecords);

  const removeItem = (employeeId: number) => {
    const updatedItems = props.currentRecords.filter((item) => item.id !== employeeId);
    setMappedItems(updatedItems);
  };

  const retainRecord = (id: number, employeeId: number) => () => {
    removeItem(employeeId)
    console.log("INITIAL INCOMING CHANGES: " + props.incomingChanges.length + "idx: " + id)
    props.incomingChanges.splice(id, 1)
    props.currentRecords.splice(id, 1)
    console.log(
      "INCOMING CHANGES: " + props.incomingChanges.length,
    )
  }

  const acceptChange = (splice: number, employeeId: number) => () => {
    setEmployeeId(employeeId)
    setSpliceId(splice)

    console.log("data: " + JSON.stringify(props.incomingChanges[splice]))
    try {
      mutate({
        id: props.incomingChanges[splice]?.id ?? 0,
        name: props.incomingChanges[splice]?.name ?? "",
        position: props.incomingChanges[splice]?.position,
        employee_id: props.incomingChanges[splice]?.employee_id,
        email: props.incomingChanges[splice]?.email,
        teamId: props.incomingChanges[splice]?.teamId ?? 0,
        superviseeId: props.incomingChanges[splice]?.superviseeId ?? 0,
        // createdAt: props.incomingChanges[splice]?.createdAt,
        // updatedAt: props.incomingChanges[splice]?.updatedAt,
        // deleted: props.incomingChanges[splice]?.deleted,
        // deletedAt: props.incomingChanges[splice]?.deletedAt,
        workMode: props.incomingChanges[splice]?.workMode,
        workStation: props.incomingChanges[splice]?.workStation,
        address: {
          // id: props.incomingChanges[splice]?.address?.id ?? 0,
          street: props.incomingChanges[splice]?.address?.street,
          city: props.incomingChanges[splice]?.address?.city,
          state: props.incomingChanges[splice]?.address?.state,
          zip: props.incomingChanges[splice]?.address?.zip,
          country: props.incomingChanges[splice]?.address?.country,
          // createdAt: props.incomingChanges[splice]?.address?.createdAt,
          // updatedAt: props.incomingChanges[splice]?.address?.updatedAt,
          //may laktaw po ito
          // deleted: props.incomingChanges[splice]?.address?.deleted,
          // deletedAt: props.incomingChanges[splice]?.address?.deletedAt,
          // userId: props.incomingChanges[splice]?.address?.userId ?? 0,
          // companyId: props.incomingChanges[splice]?.address?.companyId,
          // vendorId: props.incomingChanges[splice]?.address?.vendorId,
          // employeeId: props.incomingChanges[splice]?.address?.employeeId,
        },
        profile: {
          // id: props.incomingChanges[splice]?.profile?.id,
          first_name: props.incomingChanges[splice]?.profile?.first_name ?? "",

          middle_name: props.incomingChanges[splice]?.profile?.middle_name,
          last_name: props.incomingChanges[splice]?.profile?.last_name ?? "",
          suffix: props.incomingChanges[splice]?.profile?.suffix,
          gender: props.incomingChanges[splice]?.profile?.gender,
          image: props.incomingChanges[splice]?.profile?.image,
          date_of_birth: props.incomingChanges[splice]?.profile?.date_of_birth,
          // userId: props.incomingChanges[splice]?.profile?.userId,
          // employeeId: props.incomingChanges[splice]?.profile?.employeeId,
          phone_no: props.incomingChanges[splice]?.profile?.phone_no,
        },
      })
    } catch { }
  }

  return (

    <Accordion>
      {mappedItems.map((employee, idx) => (
        <>
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
                    onClick={retainRecord(idx, employee.id)}
                  >
                    Retain Record
                  </button>
                  <button
                    className="border-l-2 border-tangerine-600 px-2 text-tangerine-500 hover:underline disabled:text-gray-500"
                    onClick={acceptChange(idx, employee.id)}
                    disabled={employeeLoading}
                  >
                    {employeeLoading ? "Loading..." : "Accept Import"}
                  </button>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </>
      ))}
    </Accordion>

  )
}

export default DuplicateAccordion
