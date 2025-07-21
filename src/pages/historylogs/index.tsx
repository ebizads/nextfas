import React, { useEffect, useState } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import { trpc } from "../../utils/trpc"
import DisplayHistoryLogs from "../../components/historylogs/DispalyHistoryLogs"
import { HistoryLogType } from "../../types/generic"
import { useRouter } from "next/router"
import { useSearchStore } from "../../store/useStore"
import Modal from "../../components/asset/Modal"
import { useSession } from "next-auth/react"

const HistoryLogs = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: session } = useSession()
  const router = useRouter()
  const { search } = useSearchStore()
  // Get asset by asset id
  const { data: dataHistoryLogs, refetch } = trpc.historyLogs.findAll.useQuery(
    {
      search: search,
      limit,
      page,
    },
    {
      refetchInterval: 5000,
    }
  )

  const [historyLogs, setHistoryLogs] = useState<HistoryLogType[]>([])
  const [accessiblePage, setAccessiblePage] = useState<number>(0)

  useEffect(() => {
    //get and parse all data
    if (dataHistoryLogs) {
      setHistoryLogs(dataHistoryLogs.historyLogs as HistoryLogType[])
      setAccessiblePage(Math.ceil(dataHistoryLogs?.count / limit))
    }
  }, [dataHistoryLogs, limit, search])

  return (
    <DashboardLayout>
      {/* <pre>{JSON.stringify(assets, null, 2)}</pre> */}
      <div className="space-y-6">
        <DisplayHistoryLogs
          total={dataHistoryLogs?.count ?? 0}
          historyLogs={historyLogs}
          accessiblePage={accessiblePage}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          user={null}
          refetch={refetch}
        />
      </div>
    </DashboardLayout>
  )
}

export default HistoryLogs
