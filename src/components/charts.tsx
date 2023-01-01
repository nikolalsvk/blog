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

interface Props {
  data: {
    labels: string[]
    datasets: {
      data: number[]
      label: string
    }[]
  }
  color: string
}

export const BarChart = ({ data, color }: Props) => (
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

export const LineChart = ({ color, data }: Props) => (
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
