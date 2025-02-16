import React, { useState, useEffect } from "react"

function Views({ views }: { views: string }) {
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    setHighlight(true)

    setTimeout(() => {
      setHighlight(false)
    }, 2000)
  }, [views])

  if (!views)
    return (
      <span className={`${highlight ? "animate-[fadeIn_1s]" : ""}`}>
        loading views
      </span>
    )

  const formattedViews = parseInt(views, 10).toLocaleString()

  return (
    <span className={`${highlight ? "animate-[fadeIn_1s]" : ""}`}>
      <b>{formattedViews}</b> views
    </span>
  )
}

export default Views
