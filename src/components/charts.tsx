import React, { useId, useState } from "react"

interface Dataset {
  data: number[]
  label: string
  borderColor?: string
  backgroundColor?: string
  tension?: number
  borderWidth?: number
  borderRadius?: number
}

interface ChartData {
  labels: Array<string | number>
  datasets: Dataset[]
}

interface ChartProps {
  data: ChartData
  color: string
  title: string
  labelHeader: string
}

interface Plot {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}

const VIEW_WIDTH = 640
const VIEW_HEIGHT = 280
const FONT = "Roboto, sans-serif"

const formatTick = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1)

const estimateWidth = (text: string, fontSize: number) =>
  text.length * fontSize * 0.56

const niceAxis = (maxValue: number) => {
  if (maxValue <= 0) {
    return { top: 1, ticks: [0, 1] }
  }

  const roughStep = maxValue / 4
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
  const residual = roughStep / magnitude
  let step =
    residual <= 1
      ? magnitude
      : residual <= 2
      ? 2 * magnitude
      : residual <= 5
      ? 5 * magnitude
      : 10 * magnitude

  if (Number.isInteger(maxValue) && step < 1) {
    step = 1
  }

  let top = Math.ceil(maxValue / step) * step
  if (top === maxValue) {
    top += step
  }

  const ticks: number[] = []
  for (let value = 0; value <= top + step / 100; value += step) {
    ticks.push(Math.round(value * 1000) / 1000)
  }

  return { top, ticks }
}

const labelLines = (label: string, slot: number) => {
  const fontSize = 12
  if (estimateWidth(label, fontSize) <= slot - 8) {
    return [label]
  }

  const words = label.split(" ")
  if (
    words.length > 1 &&
    words.every((word) => estimateWidth(word, fontSize) <= slot - 8)
  ) {
    return words
  }

  return [label]
}

const smoothLine = (points: { x: number; y: number }[], tension: number) => {
  if (points.length === 0) {
    return ""
  }

  if (points.length === 1 || tension <= 0) {
    return points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ")
  }

  const slopes = points.slice(0, -1).map((point, index) => {
    const next = points[index + 1]
    const run = next.x - point.x
    return run === 0 ? 0 : (next.y - point.y) / run
  })
  const tangents = points.map((_, index) => {
    if (index === 0) {
      return slopes[0]
    }
    if (index === points.length - 1) {
      return slopes[slopes.length - 1]
    }
    if (slopes[index - 1] * slopes[index] <= 0) {
      return 0
    }
    return (slopes[index - 1] + slopes[index]) / 2
  })

  slopes.forEach((slope, index) => {
    if (slope === 0) {
      tangents[index] = 0
      tangents[index + 1] = 0
      return
    }

    const start = tangents[index] / slope
    const end = tangents[index + 1] / slope
    const squared = start * start + end * end
    if (squared > 9) {
      const scale = 3 / Math.sqrt(squared)
      tangents[index] = scale * start * slope
      tangents[index + 1] = scale * end * slope
    }
  })

  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 0; index < slopes.length; index++) {
    const current = points[index]
    const next = points[index + 1]
    const run = next.x - current.x
    path += ` C ${current.x + run / 3} ${
      current.y + (tangents[index] * run) / 3
    }, ${next.x - run / 3} ${next.y - (tangents[index + 1] * run) / 3}, ${
      next.x
    } ${next.y}`
  }

  return path
}

const topRoundedBar = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  if (height <= 0 || width <= 0) {
    return ""
  }

  const corner = Math.min(radius, width / 2, height)

  return [
    `M ${x} ${y + height}`,
    `H ${x + width}`,
    `V ${y + corner}`,
    `Q ${x + width} ${y} ${x + width - corner} ${y}`,
    `H ${x + corner}`,
    `Q ${x} ${y} ${x} ${y + corner}`,
    "Z",
  ].join(" ")
}

const DataTable = ({
  title,
  labelHeader,
  labels,
  datasets,
}: {
  title: string
  labelHeader: string
  labels: string[]
  datasets: Dataset[]
}) => (
  <table className="sr-only">
    <caption>{title}</caption>
    <thead>
      <tr>
        <th scope="col">{labelHeader}</th>
        {datasets.map((dataset) => (
          <th key={dataset.label} scope="col">
            {dataset.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {labels.map((label, index) => (
        <tr key={`${label}-${index}`}>
          <th scope="row">{label}</th>
          {datasets.map((dataset) => (
            <td key={dataset.label}>{dataset.data[index] ?? 0}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)

const ChartFrame = ({
  data,
  color,
  title,
  labelHeader,
  children,
}: ChartProps & {
  children: (context: {
    plot: Plot
    labels: string[]
    slot: number
    y: (value: number) => number
    active: number | null
    setActive: (index: number | null) => void
  }) => React.ReactNode
}) => {
  const [active, setActive] = useState<number | null>(null)
  const labels = data.labels.map(String)
  const { datasets } = data

  if (labels.length === 0 || datasets.length === 0) {
    return null
  }

  const axis = niceAxis(
    Math.max(0, ...datasets.flatMap((dataset) => dataset.data))
  )
  const slot = (VIEW_WIDTH - 56) / labels.length
  const layouts = labels.map((label) => labelLines(label, slot))
  const lineCount = Math.max(...layouts.map((lines) => lines.length))
  const plotBottom = VIEW_HEIGHT - (16 + lineCount * 16)
  const plot: Plot = {
    left: 40,
    right: VIEW_WIDTH - 16,
    top: 18,
    bottom: plotBottom,
    width: VIEW_WIDTH - 56,
    height: plotBottom - 18,
  }
  const y = (value: number) => plot.bottom - (value / axis.top) * plot.height

  const activeY =
    active === null
      ? 0
      : Math.min(...datasets.map((dataset) => y(dataset.data[active] ?? 0)))
  const activeX = active === null ? 0 : plot.left + slot * active + slot / 2
  const tooltipAlign =
    activeX / VIEW_WIDTH > 0.78
      ? "translate(-100%, calc(-100% - 8px))"
      : activeX / VIEW_WIDTH < 0.22
      ? "translate(0, calc(-100% - 8px))"
      : "translate(-50%, calc(-100% - 8px))"

  return (
    <figure>
      <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {datasets.map((dataset) => (
          <span key={dataset.label} className="inline-flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{
                background:
                  dataset.backgroundColor ?? dataset.borderColor ?? color,
                boxShadow: `inset 0 0 0 2px ${dataset.borderColor ?? color}`,
              }}
            />
            {dataset.label}
          </span>
        ))}
      </div>

      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          width="100%"
          role="presentation"
          style={{ fontFamily: FONT }}
          onMouseLeave={() => setActive(null)}
        >
          <line
            x1={plot.left}
            x2={plot.right}
            y1={plot.bottom - 0.5}
            y2={plot.bottom - 0.5}
            stroke={color}
            strokeWidth={1}
            strokeOpacity={0.35}
          />
          {axis.ticks.map((tick) => (
            <text
              key={tick}
              x={plot.left - 8}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={12}
              fill={color}
            >
              {formatTick(tick)}
            </text>
          ))}
          {layouts.map((lines, index) => (
            <text
              key={`${labels[index]}-${index}`}
              x={plot.left + slot * index + slot / 2}
              y={plot.bottom + 18}
              textAnchor="middle"
              fontSize={12}
              fill={color}
            >
              {lines.map((line, lineIndex) => (
                <tspan
                  key={line}
                  x={plot.left + slot * index + slot / 2}
                  dy={lineIndex === 0 ? 0 : 15}
                >
                  {line}
                </tspan>
              ))}
            </text>
          ))}
          {children({ plot, labels, slot, y, active, setActive })}
          {labels.map((label, index) => (
            <rect
              key={`hit-${label}-${index}`}
              x={plot.left + slot * index}
              y={plot.top}
              width={slot}
              height={plot.height}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setActive(index)}
              onClick={() => setActive(index)}
            />
          ))}
        </svg>

        {active !== null && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-md border px-2 py-1 text-xs shadow-md"
            style={{
              left: `${(activeX / VIEW_WIDTH) * 100}%`,
              top: `${(activeY / VIEW_HEIGHT) * 100}%`,
              transform: tooltipAlign,
              borderColor: "var(--color-primary)",
              background: "var(--color-background)",
              color: "var(--color-text)",
            }}
          >
            <div className="font-bold">{labels[active]}</div>
            {datasets.map((dataset) => (
              <div key={dataset.label}>
                {dataset.label}: {dataset.data[active] ?? 0}
              </div>
            ))}
          </div>
        )}
      </div>

      <DataTable
        title={title}
        labelHeader={labelHeader}
        labels={labels}
        datasets={datasets}
      />
    </figure>
  )
}

export const BarChart = ({ data, color, title, labelHeader }: ChartProps) => {
  const clipId = useId().replace(/:/g, "")

  return (
    <ChartFrame
      data={data}
      color={color}
      title={title}
      labelHeader={labelHeader}
    >
      {({ plot, slot, y, active }) => (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect
                x={plot.left}
                y={plot.top}
                width={plot.width}
                height={plot.height}
              />
            </clipPath>
          </defs>
          {data.datasets.map((dataset, datasetIndex) => {
            const gap = data.datasets.length > 1 ? 4 : 0
            const barWidth = Math.min(
              42,
              (slot * 0.7 - gap * (data.datasets.length - 1)) /
                data.datasets.length
            )
            const groupWidth =
              barWidth * data.datasets.length + gap * (data.datasets.length - 1)
            const fill = dataset.backgroundColor ?? dataset.borderColor ?? color
            const stroke = dataset.borderColor ?? color
            const strokeWidth = dataset.borderWidth ?? 0
            const inset = strokeWidth / 2

            return data.labels.map((label, index) => {
              const value = dataset.data[index] ?? 0
              const x =
                plot.left +
                slot * index +
                (slot - groupWidth) / 2 +
                datasetIndex * (barWidth + gap)
              const barTop = y(value) + inset
              const barHeight = Math.max(0, plot.bottom - inset - barTop)

              return (
                <g
                  key={`${dataset.label}-${label}-${index}`}
                  opacity={active === null || active === index ? 1 : 0.45}
                >
                  <path
                    d={topRoundedBar(
                      x + inset,
                      barTop,
                      Math.max(0, barWidth - strokeWidth),
                      barHeight,
                      Math.max(0, (dataset.borderRadius ?? 8) - inset)
                    )}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    clipPath={`url(#${clipId})`}
                  />
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(plot.top + 12, y(value) - 6)}
                    textAnchor="middle"
                    fontSize={11}
                    fill={color}
                  >
                    {value}
                  </text>
                </g>
              )
            })
          })}
        </>
      )}
    </ChartFrame>
  )
}

export const LineChart = ({ data, color, title, labelHeader }: ChartProps) => (
  <ChartFrame data={data} color={color} title={title} labelHeader={labelHeader}>
    {({ plot, slot, y, active }) =>
      data.datasets.map((dataset) => {
        const points = data.labels.map((_, index) => ({
          x: plot.left + slot * index + slot / 2,
          y: y(dataset.data[index] ?? 0),
        }))
        const stroke = dataset.borderColor ?? color
        const pointFill = dataset.backgroundColor ?? stroke

        return (
          <g key={dataset.label}>
            <path
              d={smoothLine(points, dataset.tension ?? 0)}
              fill="none"
              stroke={stroke}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {points.map((point, index) => (
              <circle
                key={`${dataset.label}-${index}`}
                cx={point.x}
                cy={point.y}
                r={active === index ? 5 : 3.5}
                fill={pointFill}
                stroke={stroke}
                strokeWidth={2}
              />
            ))}
          </g>
        )
      })
    }
  </ChartFrame>
)
