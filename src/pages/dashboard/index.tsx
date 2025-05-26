import React, { useEffect, useState } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import { trpc } from "../../utils/trpc"
import DisplayAssets from "../../components/asset/DisplayAssets"
import DisplayDashboard from "../../components/dashboard/DisplayDashboard"
import { AssetType } from "../../types/generic"
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
    LineElement
} from 'chart.js'

// Register ChartJS components
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

// Chart type enum
type ChartType = 'bar' | 'pie' | 'line'

const Dashboard = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [chartType, setChartType] = useState<ChartType>('bar')
    const router = useRouter()
    const { search } = useSearchStore()

    // Get asset data
    const { data: dataAssets } = trpc.asset.findAll.useQuery({
        search: { name: search },
        limit,
        page,
    })

    const { data: sample } = trpc.asset.findAllSample.useQuery({
        search: { name: search },
        limit,
        page,
    })

    // Mock data for today's transactions (replace with actual API calls)
    const firearmsInToday = 12;
    const firearmsIssuedToday = 8;

    const [assets, setAssets] = useState<AssetType[]>([])
    const [accessiblePage, setAccessiblePage] = useState<number>(0)
    const [sampleAssets, setSampleAssets] = useState<AssetType[]>([])

    useEffect(() => {
        if (dataAssets) {
            setAssets(dataAssets.assets as AssetType[])
            setAccessiblePage(Math.ceil(dataAssets?.count / limit))
        }
        if (sample) {
            setSampleAssets(sample.assets as AssetType[])
        }
    }, [dataAssets, limit, router, sample, search])

    // Generate distinct colors for each category
    const generateColors = (count: number) => {
        const colors = []
        const hueStep = 360 / count

        for (let i = 0; i < count; i++) {
            const hue = i * hueStep
            colors.push({
                background: `hsla(${hue}, 70%, 50%, 0.5)`,
                border: `hsla(${hue}, 70%, 50%, 1)`
            })
        }

        return colors
    }

    // Prepare chart data
    const typeCounts: Record<string, number> = {};
    assets.forEach(asset => {
        if (asset.type) {
            typeCounts[asset.type] = (typeCounts[asset.type] || 0) + 1;
        }
    });

    const labels = Object.keys(typeCounts)
    const dataValues = Object.values(typeCounts)
    const colorSet = generateColors(labels.length)

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Number of Firearms',
                data: dataValues,
                backgroundColor: colorSet.map(c => c.background),
                borderColor: colorSet.map(c => c.border),
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Firearms by Type',
            },
        },
    };

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <div className="relative w-full h-64">
                        <Bar
                            data={chartData}
                            options={{
                                ...chartOptions,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                )
                
            case 'pie':
                return (
                    <div className="relative w-full h-64">
                        <Pie
                            data={chartData}
                            options={{
                                ...chartOptions,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                )
            case 'line':
                return (
                    <div className="relative w-full h-64 flex justify-center items-center">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                )
                
            default:
                return <Bar data={chartData} options={chartOptions} />
        }
    }


    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* 1st Row */}
                <div className="flex flex-row gap-4">
                    {/* 1st Column - Total Firearms */}
                    <div className="w-1/3 bg-white p-6 rounded-lg shadow">
                        {/* Centered Image */}
                        <div className="flex justify-center">
                            <img
                                src="/gun.webp"
                                alt="Firearm Icon"
                                className="w-48 h-48 mb-2"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <svg
                                    className="w-16 h-16 text-blue-600"
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
                                <h2 className="text-8xl font-bold">{dataAssets?.count || 0}</h2>
                                <p className="text-gray-500">Total Firearms in Stock</p>
                            </div>
                        </div>
                    </div>


                    {/* 2nd Column - Chart */}
                    <div className="w-2/3 bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-end mb-4 space-x-2">
                            <button
                                onClick={() => setChartType('bar')}
                                className={`px-3 py-1 rounded ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Bar
                            </button>
                            <button
                                onClick={() => setChartType('pie')}
                                className={`px-3 py-1 rounded ${chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Pie
                            </button>
                            <button
                                onClick={() => setChartType('line')}
                                className={`px-3 py-1 rounded ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Line
                            </button>
                        </div>
                        {labels.length > 0 ? (
                            renderChart()
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                <p className="text-gray-500">No data available for chart</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2nd Row */}
                <div className="flex flex-row gap-4">
                    {/* 1st Column - Firearms In Today */}
                    <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-4 rounded-full">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">{firearmsInToday}</h2>
                                <p className="text-gray-500">Total Firearms In</p>
                                <p className="text-sm text-gray-400">(today)</p>
                            </div>
                        </div>
                    </div>

                    {/* 2nd Column - Firearms Issued Today */}
                    <div className="flex-1 bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center space-x-4">
                            <div className="bg-red-100 p-4 rounded-full">
                                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
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

                {/* 3rd Row */}
                <div className="space-y-4">
                    <h3 className="text-xl font-medium">Recent Issuance</h3>
                    <DisplayDashboard
                        total={dataAssets?.count ?? 0}
                        assets={assets}
                        assetsSample={sampleAssets}
                        accessiblePage={accessiblePage}
                        page={page}
                        setPage={setPage}
                        limit={limit}
                        setLimit={setLimit}
                        user={null}
                    />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Dashboard