import React, {useEffect, useState } from 'react'
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
    const [employees, setEmployee]=useState<EmployeeType[]>([])
    const [employeePage, setEmployeePage] = useState<number>(0)
    const {search} = useSearchStore()


    const { data } = trpc.employee.findAll.useQuery({
        search: {employee_id: search},
        limit,
        page,
    })

    console.log("sample ", data, search);

    useEffect(()=>{
        if(data){
            setEmployee(data.employees as EmployeeType[])
            setEmployeePage(Math.ceil(data?.total / limit))
        }
    }, [data, limit, router, search]);

    

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Employees</h3>
                <DisplayEmployees
                    total={data?.total ?? 0}
                    employees={employees}
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