import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { trpc } from '../../utils/trpc'
import DisplayUsers from './DisplayUsers'

const User = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const { data } = trpc.user.findAll.useQuery({
        limit,
        page,
    })

    console.log(data?.user);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Users</h3>
                <DisplayUsers
                    total={data?.total ?? 0}
                    users={data?.user ?? []}
                    userPage={data?.pages ?? 0}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            </div>
        </DashboardLayout>
    )
}

export default User