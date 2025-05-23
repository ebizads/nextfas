import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DashboardDisplay = ({
  totalItems,
  totalFirearmsIn,
  totalFirearmsIssued,
}: {
  totalItems: number
  totalFirearmsIn: number
  totalFirearmsIssued: number
}) => {
  // Sample data for the bar chart
  const data = [
    { name: 'Jan', items: 4000 },
    { name: 'Feb', items: 3000 },
    { name: 'Mar', items: 2000 },
    { name: 'Apr', items: 2780 },
    { name: 'May', items: 1890 },
    { name: 'Jun', items: 2390 },
  ]

  return (
    <div className="space-y-6">
      {/* First Row */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Total Items Card */}
        <div className="flex-1 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-500">Total Items</h3>
          <p className="mt-2 text-3xl font-bold">{totalItems.toLocaleString()}</p>
        </div>

        {/* Bar Graph */}
        <div className="flex-1 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-500">Items Overview</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="items" fill="#F97316" /> {/* Tangerine color */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Firearms In Card */}
        <div className="flex-1 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-500">Total Firearms In</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {totalFirearmsIn.toLocaleString()}
          </p>
        </div>

        {/* Firearms Issued Card */}
        <div className="flex-1 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-500">Total Firearms Issued</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {totalFirearmsIssued.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardDisplay