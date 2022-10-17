import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { EmployeeType } from '../../types/assets'
import { trpc } from '../../utils/trpc'
import DisplayEmployees from './employees'

const Employee = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)


    const [employees, setEmployees] = useState<EmployeeType[]>([])
    const [employeesPage, setEmployeesPage] = useState<number>(0)

    const { data } = trpc.employee.findAll.useQuery({
        limit,
        page,
    })


    useEffect(() => {
        if (data) {

            setEmployees(data.employees)


            setEmployeesPage(Math.ceil(data?.total / limit))

            //console.log(employees);
        }

    }, [data, limit])

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Assets</h3>
                <DisplayEmployees
                    total={data?.total ?? 0}
                    employees={employees}
                    employeePage={employeesPage}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            </div>
        </DashboardLayout>
    )
}

export default Employee