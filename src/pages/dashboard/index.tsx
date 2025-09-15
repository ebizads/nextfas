//OLD dashboard working

import React, { useEffect, useState, useMemo } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import { trpc } from "../../utils/trpc"
import DisplayAssets from "../../components/asset/DisplayAssets"
import DisplayDashboard from "../../components/dashboard/DisplayDashboard"
import { Asset, AssetType, AssetTypeDashboard } from "../../types/generic"
import { useRouter } from "next/router"
import { useSearchStore } from "../../store/useStore"
import { Bar, Pie, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartData,
  ChartOptions,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

type ChartType = "bar" | "pie" | "line"

type ChartDataType = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
    hoverOffset?: number
    borderRadius?: number
  }[]
}

const Dashboard = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [chartType, setChartType] = useState<ChartType>("bar")
  const router = useRouter()
  const { search } = useSearchStore()

  // Get asset data
  const { data: dataAssets, refetch } = trpc.asset.findAllDashboard.useQuery({
    search: { name: search },
    limit,
    page,
  })

  const { data: dataAssetsChart } = trpc.asset.findAssetToday.useQuery()

  // Mock data for today's transactions (replace with actual API calls)
  const [firearmsInToday, setFirearmsInToday] = useState(0)
  const [firearmsIssuedToday, setFirearmsIssuedToday] = useState(0)

  const [assets, setAssets] = useState<Asset[]>([])
  const [assetType, setAssetType] = useState<AssetTypeDashboard[]>([])
  const [accessiblePage, setAccessiblePage] = useState<number>(0)

  useEffect(() => {
    if (dataAssets) {
      setAssets(dataAssets.assets as Asset[])
      setAccessiblePage(Math.ceil(dataAssets?.count / limit))
    }
  }, [dataAssets, limit, router, search])

  useEffect(() => {
    if (dataAssetsChart?.assetType)
      setAssetType(dataAssetsChart?.assetType as AssetTypeDashboard[])

    if (dataAssetsChart?.assetsInToday)
      setFirearmsInToday(dataAssetsChart?.assetsInToday)

    if (dataAssetsChart?.assetsIssuedToday)
      setFirearmsIssuedToday(dataAssetsChart?.assetsIssuedToday)
  }, [dataAssetsChart])

  // Prepare chart data
  const typeCounts: Record<string, number> = {}
  assets.forEach((asset) => {
    const typeName = asset?.type?.name
    if (typeName) {
      typeCounts[typeName] = (typeCounts[typeName] || 0) + 1
    }
  })

  const getColorPalette = useMemo(() => {
    const palette = [
      "#6B8E23",
      "#FF4500",
      "#DC143C",
      "#F0E68C",
      "#C0C0C0",
      "#36454F",
      // "#8AC24A",
      // "#F06292",
      // "#7986CB",
      // "#E57373",
      // "#64B5F6",
      // "#BA68C8",
      // "#4DB6AC",
      // "#81C784",
      // "#FFB74D",
    ]
    return (index: number) => ({
      background: `${palette[index % palette.length]}80`,
      border: palette[index % palette.length],
    })
  }, [])

  const { chartData, hasData } = useMemo(() => {
    const typeCounts = assetType.reduce((acc, type) => {
      const typeName = type?.name || "Unknown"
      acc[typeName] = type?.assets?.length ?? 0
      return acc
    }, {} as Record<string, number>)

    const labels = Object.keys(typeCounts).filter(
      (label) => label !== "Unknown"
    )
    const dataValues = labels.map((label) => typeCounts[label])

    return {
      chartData: {
        labels,
        datasets: [
          {
            label: "Number of Firearms",
            data: dataValues,
            backgroundColor: labels.map(
              (_, i) => getColorPalette(i).background
            ),
            borderColor: labels.map((_, i) => getColorPalette(i).border),
            borderWidth: 1,
            hoverOffset: 4,
            borderRadius: 6,
          },
        ],
      } as ChartData<"bar" | "pie" | "line", number[], string>,
      hasData: labels.length > 0,
    }
  }, [assetType, getColorPalette])

  const chartOptions = useMemo<ChartOptions<"bar" | "pie" | "line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          // position: "top",
          // labels: {
          //   usePointStyle: true,
          //   pointStyle: "circle",
          //   padding: 20,
          //   font: {
          //     size: 12,
          //     family: "'Inter', sans-serif",
          //     weight: "normal" as const,
          //   },
          //   generateLabels: (chart) => {
          //     const { data } = chart
          //     if (data.labels?.length && data.datasets.length) {
          //       return data.labels.map((label, i) => ({
          //         text: label as string,
          //         fillStyle: getColorPalette(i).background,
          //         strokeStyle: getColorPalette(i).border,
          //         lineWidth: 1,
          //         hidden: !chart.isDatasetVisible(0),
          //         index: i,
          //       }))
          //     }
          //     return []
          //   },
          // },
          // onClick: (_, legendItem, legend) => {
          //   const ci = legend.chart
          //   ci.setDatasetVisibility(
          //     legendItem.datasetIndex ?? 0,
          //     !ci.isDatasetVisible(legendItem.datasetIndex ?? 0)
          //   )
          //   ci.update()
          // },
          display: false,
        },
        title: {
          display: true,
          text: "Firearms by Type",
          font: {
            size: 16,
            weight: "bold" as const,
            family: "'Inter', sans-serif",
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ""
              const value = (context.raw as number) || 0
              const total = (context.dataset.data as number[]).reduce(
                (a, b) => a + b,
                0
              )
              const percentage = Math.round((value / total) * 100)
              return `${label}: ${value} (${percentage}%)`
            },
          },
        },
      },
      ...(chartType === "pie" && {
        cutout: "50%",
        radius: "90%",
      }),
      ...(chartType !== "pie" && {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      }),
    }),
    [chartType, getColorPalette]
  )

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <Bar
            data={chartData as ChartData<"bar", number[], string>}
            options={chartOptions as ChartOptions<"bar">}
            redraw
          />
        )
      case "line":
        return (
          <Line
            data={chartData as ChartData<"line", number[], string>}
            options={chartOptions as ChartOptions<"line">}
            redraw
          />
        )
      case "pie":
        return (
          <Pie
            data={chartData as ChartData<"pie", number[], string>}
            options={chartOptions as ChartOptions<"pie">}
            redraw
          />
        )
      default:
        return (
          <Bar
            data={chartData as ChartData<"bar", number[], string>}
            options={chartOptions as ChartOptions<"bar">}
            redraw
          />
        )
    }
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 1st Row */}
        <div className="flex flex-row gap-4">
          {/* 1st Column - Firearms In Today */}
          <div className="flex-1 rounded-lg bg-white p-6 shadow">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-green-100 p-4">
                <svg
                  className="h-16 w-16 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {dataAssets?.allCount || 0}
                </h2>
                <p className="text-gray-500">Total Firearms in Stock</p>
              </div>
            </div>
          </div>

          {/* 2nd Column - Firearms In Today */}
          <div className="flex-1 rounded-lg bg-white p-6 shadow">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-green-100 p-4">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{firearmsInToday}</h2>
                <p className="text-gray-500">Total Firearms In</p>
                <p className="text-sm text-gray-400">(today)</p>
              </div>
            </div>
          </div>

          {/* 3rd Column - Firearms Issued Today */}
          <div className="flex-1 rounded-lg bg-white p-6 shadow">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-red-100 p-4">
                <svg
                  className="h-12 w-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{firearmsIssuedToday}</h2>
                <p className="text-gray-500">Total Firearms Issued</p>
                <p className="text-sm text-gray-400">(today)</p>
              </div>
            </div>
          </div>
        </div>
        {/* 2nd Row */}

        <div className="flex flex-row gap-4">
          <div className="w-full rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Firearms Distribution
              </h3>
              <div className="flex space-x-2">
                {(["bar", "pie", "line"] as ChartType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`rounded-md px-3 py-1 text-sm ${chartType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    <i className={`fas fa-chart-${type} mr-1`}></i>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {hasData ? (
              <div className="relative h-96 w-full">{renderChart()}</div>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <p className="text-gray-500">No data available for chart</p>
              </div>
            )}
          </div>
        </div>

        {/* 3rd Row */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Recent Issuance</h3>
          <DisplayDashboard
            total={dataAssets?.count ?? 0}
            assets={dataAssets?.assets ?? []}
            accessiblePage={accessiblePage}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            user={null}
            refetch={refetch}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
