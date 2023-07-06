import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { EmployeeType } from '../../types/generic'
import { trpc } from '../../utils/trpc'
import { useRouter } from "next/router"
import DisplayEmployees from '../../components/employee/DisplayEmployees'
import { useSearchStore } from '../../store/useStore'

const Employee = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const router = useRouter()
    const [employees, setEmployee] = useState<EmployeeType[]>([])
    const [sampleEmployee, setSampleEmployee] = useState<EmployeeType[]>([])

    const [employeePage, setEmployeePage] = useState<number>(0)
    const { search } = useSearchStore()


    const { data: dataEmp } = trpc.employee.findAll.useQuery({
        search: {
            employee_id: search,
            name: search
        },
        limit,
        page,
    })

    const { data: sample } = trpc.employee.findAllSample.useQuery({
        search: { name: search },
        limit,
        page,
    })

    console.log("sample ", dataEmp, search);

    useEffect(() => {
        if (dataEmp) {
            setEmployee(dataEmp.employees as EmployeeType[])
            setEmployeePage(Math.ceil(dataEmp?.total / limit))
        }
        if (sample) {
            setSampleEmployee(sample.employees as EmployeeType[])
        }
    }, [dataEmp, limit, router, sample, search]);



    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Employees</h3>
                <DisplayEmployees
                    total={dataEmp?.total ?? 0}
                    employees={employees}
                    sampleEmployee={sampleEmployee}
                    employeePage={employeePage}
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