import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { AssetActionType } from '../../types/generic'
import { trpc } from '../../utils/trpc'
import { useRouter } from "next/router"
import { useSearchStore } from '../../store/useStore'
import DisplayActionTypes from '../../components/actiontype/DisplayActionTypes'

const ActionTypeManagement = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const router = useRouter()
    const [actionType, setActionType] = useState<AssetActionType[]>([])
    const [sampleActionType, setSampleActionType] = useState<AssetActionType[]>([])
    const [actionTypePage, setActionTypePage] = useState<number>(0)

    const { search } = useSearchStore()

    const { data: dataActionType } = trpc.assetActionType.findAll.useQuery({
        search: { name: search },
        limit,
        page,
    })

    const { data: sampleActionTypeData } = trpc.assetActionType.findAllSample.useQuery({
        search: { name: search },
        limit,
        page,
    })

    useEffect(() => {
        if (dataActionType) {
            setActionType(dataActionType.assetActionTypes as AssetActionType[])
            setActionTypePage(Math.ceil(dataActionType?.count / limit))
        }
        if (sampleActionTypeData) {
            setSampleActionType(sampleActionTypeData.assetActionTypes as AssetActionType[])
        }
    }, [dataActionType, limit, router, sampleActionTypeData, search])

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h3 className="text-xl font-medium">Asset Details Management</h3>

                <h5 className="text-lg font-medium my-2">Action Types</h5>
                <DisplayActionTypes
                    total={dataActionType?.total ?? 0}
                    actionTypes={actionType}
                    sampleActionTypes={sampleActionType}
                    actionTypePage={actionTypePage}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            </div>
        </DashboardLayout>
    )
}

export default ActionTypeManagement
