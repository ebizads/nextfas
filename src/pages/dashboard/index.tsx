//OLD dashboard working

import React, { useEffect, useState, useMemo } from "react"
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
);

type ChartType = 'bar' | 'pie' | 'line';

type ChartDataType = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
        hoverOffset?: number;
        borderRadius?: number;
    }[];
};

const Dashboard = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState()
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
        const colors = [];
        // Use a fixed set of distinct colors for better consistency
        const distinctColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#8AC24A', '#F06292', '#7986CB', '#E57373',
            '#64B5F6', '#BA68C8', '#4DB6AC', '#81C784', '#FFB74D'
        ];

        for (let i = 0; i < count; i++) {
            // Cycle through distinct colors if we have more types than colors
            const color = distinctColors[i % distinctColors.length];
            colors.push({
                background: `${color}80`, // Add alpha channel for background
                border: color
            });
        }

        return colors;
    };

    // Prepare chart data
    const typeCounts: Record<string, number> = {};
    assets.forEach(asset => {
        const typeName = asset?.type?.name;
        if (typeName) {
            typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
        }
    });

    const labels = Object.keys(typeCounts).filter(label => label !== 'Unknown'); // Optional: filter out 'Unknown'
    const dataValues = labels.map(label => typeCounts[label]);
    const colorSet = generateColors(labels.length);

    const getColorPalette = useMemo(() => {
        const palette = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#8AC24A', '#F06292', '#7986CB', '#E57373',
            '#64B5F6', '#BA68C8', '#4DB6AC', '#81C784', '#FFB74D'
        ];
        return (index: number) => ({
            background: `${palette[index % palette.length]}80`,
            border: palette[index % palette.length]
        });
    }, []);

    const { chartData, hasData } = useMemo(() => {
        const typeCounts = assets.reduce((acc, asset) => {
            const typeName = asset?.type?.name || 'Unknown';
            acc[typeName] = (acc[typeName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const labels = Object.keys(typeCounts).filter(label => label !== 'Unknown');
        const dataValues = labels.map(label => typeCounts[label]);

        return {
            chartData: {
                labels,
                datasets: [{
                    label: 'Number of Firearms',
                    data: dataValues,
                    backgroundColor: labels.map((_, i) => getColorPalette(i).background),
                    borderColor: labels.map((_, i) => getColorPalette(i).border),
                    borderWidth: 1,
                    hoverOffset: 4,
                    borderRadius: 6,
                }]
            } as ChartData<'bar' | 'pie' | 'line', number[], string>,
            hasData: labels.length > 0
        };
    }, [assets, getColorPalette]);

    const chartOptions = useMemo<ChartOptions<'bar' | 'pie' | 'line'>>(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                        weight: 'normal' as const
                    },
                    generateLabels: (chart) => {
                        const { data } = chart;
                        if (data.labels?.length && data.datasets.length) {
                            return data.labels.map((label, i) => ({
                                text: label as string,
                                fillStyle: getColorPalette(i).background,
                                strokeStyle: getColorPalette(i).border,
                                lineWidth: 1,
                                hidden: !chart.isDatasetVisible(0),
                                index: i
                            }));
                        }
                        return [];
                    }
                },
                onClick: (_, legendItem, legend) => {
                    const ci = legend.chart;
                    ci.setDatasetVisibility(legendItem.datasetIndex, !ci.isDatasetVisible(legendItem.datasetIndex));
                    ci.update();
                }
            },
            title: {
                display: true,
                text: 'Firearms by Type',
                font: {
                    size: 16,
                    weight: 'bold' as const,
                    family: "'Inter', sans-serif"
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw as number || 0;
                        const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        ...(chartType === 'pie' && {
            cutout: '50%',
            radius: '90%',
        }),
        ...(chartType !== 'pie' && {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        })
    }), [chartType, getColorPalette]);


    const renderChart = () => {
        const chartProps = {
            data: chartData,
            options: chartOptions,
            redraw: true
        };

        switch (chartType) {
            case 'bar':
                return <Bar {...chartProps} />;
            case 'pie':
                return <Pie {...chartProps} />;
            case 'line':
                return <Line {...chartProps} />;
            default:
                return <Bar {...chartProps} />;
        }
    };


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
                                className="w-48 h-48 mb-20"
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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Firearms Distribution</h3>
                            <div className="flex space-x-2">
                                {(['bar', 'pie', 'line'] as ChartType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setChartType(type)}
                                        className={`px-3 py-1 rounded-md text-sm ${chartType === type
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <i className={`fas fa-chart-${type} mr-1`}></i>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {hasData ? (
                            <div className="relative w-full h-96">
                                {renderChart()}
                            </div>
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