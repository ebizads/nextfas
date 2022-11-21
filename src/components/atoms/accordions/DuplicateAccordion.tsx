import { Accordion } from '@mantine/core';
import { Employee } from '@prisma/client';

const DuplicateAccordion = (props: { currentRecords: Employee[], incomingChanges: unknown[] }) => {

  return (
    <Accordion>
      {props.currentRecords.map((employee, idx) => (
        <Accordion.Item value={employee.id.toString()} key={idx}>
          <Accordion.Control className='uppercase'>
            <div className='grid grid-cols-2 gap-1 w-1/2'>
              <p>{employee.employee_id}</p>
              <p>{employee.name}</p>
            </div></Accordion.Control>
          <Accordion.Panel>
            <div className='flex flex-col gap-2'>
              <div className='flex gap-4'>
                <div className='flex flex-col gap-1'>
                  <p className='text-light-secondary text-sm'>Current Record</p>
                  <pre className='text-sm'>{JSON.stringify(employee, null, 2)}</pre>
                </div>
                <div className='flex flex-col gap-1 border-l-2 border-tangerine-500 px-4'>
                  <p className='text-light-secondary text-sm'>Incoming Change</p>
                  <pre className='text-sm'>{props.incomingChanges ? JSON.stringify(props.incomingChanges[idx], null, 2) : <></>}</pre>
                </div>
              </div>
              <div className='flex gap-1 items-center justify-end'>
                <button className='px-2 hover:underline'>Retain Record</button>
                <button className='px-2 hover:underline text-tangerine-500 border-l-2 border-tangerine-600'>Accept Incoming Change</button>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default DuplicateAccordion