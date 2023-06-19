import { Accordion } from "@mantine/core"
import { Employee } from "@prisma/client"
import { trpc } from "../../../utils/trpc"
const DuplicateAccordion = (props: {
  currentRecords: Employee[]
  incomingChanges: unknown[]
}) => {
  // const [id, setId] = useState(null)
  // const acceptChange = () => {
  //   const { data: duplicates } = trpc.employee.createOrUpdate.useQuery(idList)
  // }
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
                  <p className="text-sm text-light-secondary">Current Record</p>
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
                <button className="px-2 hover:underline">Retain Record</button>
                <button className="border-l-2 border-tangerine-600 px-2 text-tangerine-500 hover:underline">
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
