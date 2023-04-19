import React, {useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { LocationType } from '../../types/generic'
import { trpc } from '../../utils/trpc'
import { useRouter } from "next/router"
import DisplayLocationMaintenance from '../../components/maintenance/DisplayLocationMaintenance'
import { useSearchStore } from '../../store/useStore'

const Maintenance = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const router = useRouter()
    const [locations, setLocations]=useState<LocationType[]>([])
    const [locationPage, setLocationPage] = useState<number>(0)
    const {search} = useSearchStore()


    const { data } = trpc.maintenance.findAll.useQuery({
        search: {building: search},
        limit,
        page,
    })

    console.log("sample ", data, search);

    useEffect(()=>{
        if(data){
            setLocations(data.location as LocationType[])
            setLocationPage(Math.ceil(data?.total / limit))
        }
    }, [data, limit, router, search]);

    

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Location Maintenance</h3>
                <DisplayLocationMaintenance
                    total={data?.total ?? 0}
                    location={locations}
                    locationPage={locationPage}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            </div>
        </DashboardLayout>
    )
}

export default Maintenance