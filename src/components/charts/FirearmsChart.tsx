// components/charts/FirearmsChart.tsx
import React, { useMemo } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
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
  ChartOptions
} from 'chart.js';

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

interface FirearmsChartProps {
  assets: any[];
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

const FirearmsChart = ({ assets, chartType, onChartTypeChange }: FirearmsChartProps) => {
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
    <div className="w-full bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Firearms Distribution</h3>
        <div className="flex space-x-2">
          {(['bar', 'pie', 'line'] as ChartType[]).map((type) => (
            <button
              key={type}
              onClick={() => onChartTypeChange(type)}
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
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
  );
};

export default FirearmsChart;