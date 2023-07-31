import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { trpc } from '../../utils/trpc'
import DisplayUsers from './DisplayUsers'
import { UserType } from '../../types/generic'
import { useRouter } from "next/router";
import { useSearchStore } from '../../store/useStore'


const User = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const [accessiblePage, setAccessiblePage] = useState<number>(0);
    const router = useRouter();
    const { search } = useSearchStore()


    const { data } = trpc.user.findAll.useQuery({
        search: { name: search },
        limit,
        page,
    })

    const [users, setUsers] = useState<UserType[]>([]);


    useEffect(
        () => {

            //get and parse all data
            if (data) {
                setUsers(data.user as UserType[]);
                setAccessiblePage(Math.ceil(data.count / limit));
            }
        },
        [data, limit, router]
    );

    console.log(data?.user);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Users</h3>
                <DisplayUsers
                    total={data?.count ?? 0}
                    users={users}
                    userPage={accessiblePage}
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