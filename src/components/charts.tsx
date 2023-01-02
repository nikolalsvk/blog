import React from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js"
import { Bar, Line } from "react-chartjs-2"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
)

interface BarProps {
  data: {
    labels: string[]
    datasets: {
      data: number[]
      label: string
      borderColor?: string
      backgroundColor?: string
      tension?: number
    }[]
  }
  color: string
}

export const BarChart = ({ data, color }: BarProps) => (
  <Bar
    options={{
      scales: {
        y: { ticks: { color }, grid: { display: false } },
        x: { ticks: { color }, grid: { display: false } },
      },
    }}
    data={data}
  />
)

interface LineProps {
  data: {
    labels: number[]
    datasets: {
      data: number[]
      label: string
      borderColor?: string
      backgroundColor?: string
      tension?: number
    }[]
  }
  color: string
}

export const LineChart = ({ color, data }: LineProps) => (
  <Line
    options={{
      scales: {
        y: { ticks: { color }, grid: { display: false } },
        x: { ticks: { color }, grid: { display: false } },
      },
    }}
    data={data}
  />
)
