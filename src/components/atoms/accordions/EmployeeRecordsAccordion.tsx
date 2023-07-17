import { Accordion } from "@mantine/core"
import { ExcelExportType } from "../../../types/employee"
import { EmployeeType } from "../../../types/generic"
import { trpc } from "../../../utils/trpc"

const EmployeeRecordsAccordion = (props: {
  incomingChanges: ExcelExportType[]
}) => {

  return (
    <Accordion>
      {props.incomingChanges?.map((employee, idx) => (
        <Accordion.Item
          value={employee?.id?.toString() ?? (0).toString()}
          key={idx}
        >
          <Accordion.Control className="uppercase">
            <div className="grid w-1/2 grid-cols-2 gap-1">
              <p>{employee.name}</p>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
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
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

export default EmployeeRecordsAccordion
