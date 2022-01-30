import React, { useState } from "react"
import styled from "styled-components"

const CopyButton = ({
  children,
  postUrl,
}: {
  children: JSX.Element
  postUrl: string
}) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (postUrl: string) => {
    if (copied) return

    navigator.clipboard.writeText(postUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (window?.navigator?.clipboard) {
    return (
      <Button onClick={() => copyToClipboard(postUrl)}>
        {children}
        {copied ? "Copied, thanks ❤️" : "Copy link"}
      </Button>
    )
  }

  return null
}

export default CopyButton

const Button = styled.button`
  border: 0;
  padding: 0;
  background: none;
  color: var(--color-text);
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 24px;
`
