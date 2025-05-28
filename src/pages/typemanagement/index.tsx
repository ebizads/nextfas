import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { AssetType } from '../../types/generic'
import { trpc } from '../../utils/trpc'
import { useRouter } from "next/router"
import { useSearchStore } from '../../store/useStore'
import DisplayType from '../../components/type/DisplayType'

const TypeManagement = () => {
    const [typePage, setTypePage] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const router = useRouter()
    const [type, setType] = useState<AssetType[]>([])
    const [sampleType, setSampleType] = useState<AssetType[]>([])

    const { search } = useSearchStore()

    const { data: dataType } = trpc.assetType.findAll.useQuery({
        search: { name: search },
        limit,
        page,
    })

    const { data: sampleTypeData } = trpc.assetType.findAllSample.useQuery({
        search: { name: search },
        limit,
        page,
    })

    useEffect(() => {
        if (dataType) {
            setType(dataType.assetTypes as AssetType[])
            setTypePage(Math.ceil(dataType?.count / limit))
        }
        if (sampleTypeData) {
            setSampleType(sampleTypeData.assetTypes as AssetType[])
        }
    }, [dataType, limit, router, sampleTypeData, search])

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Asset Details Management</h3>

                <h5 className="text-lg font-medium my-2">Asset Types</h5>
                <DisplayType
                    total={dataType?.total ?? 0}
                    types={type}
                    sampleTypes={sampleType}
                    typePage={typePage}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            </div>
        </DashboardLayout>
    )
}

export default TypeManagement
