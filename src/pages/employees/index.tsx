import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { trpc } from '../../utils/trpc'
import DisplayEmployees from '../../components/employee/DisplayEmployees'
import { useSearchStore } from '../../store/useStore'

const Employee = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const { search } = useSearchStore()
    
    const { data } = trpc.employee.findAll.useQuery({
        search: { employee_id: search },
        limit,
        page,
    })

    console.log(data?.employees);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Employees</h3>
                <DisplayEmployees
                    total={data?.total ?? 0}
                    employees={data?.employees ?? []}
                    employeePage={data?.pages ?? 0}
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