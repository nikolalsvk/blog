import React, { useState, useEffect } from "react"
import styled, { css, keyframes } from "styled-components"

const highlightBackgound = keyframes`
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
`

const StyledViews = styled.span`
  ${(props: { highlight?: boolean }) =>
    props.highlight &&
    css`
      animation-name: ${highlightBackgound};
      animation-duration: 1s;
    `}
`

function Views({ views }: { views: string }) {
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    if (views) {
      setHighlight(true)
    }

    setTimeout(() => {
      setHighlight(false)
    }, 2000)
  }, [views])

  if (!views) return <StyledViews>loading views</StyledViews>

  const formattedViews = parseInt(views, 10).toLocaleString()

  return (
    <StyledViews highlight={highlight}>
      <b>{formattedViews}</b> views
    </StyledViews>
  )
}

export default Views
