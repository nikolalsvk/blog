import React, { useState } from "react"
import { isBrowser } from "../utils/is-browser"

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

  if (isBrowser() && window?.navigator?.clipboard) {
    return (
      <button
        id="copy-link"
        onClick={() => copyToClipboard(postUrl)}
        className="border-0 p-0 bg-none text-[var(--color-text)] flex items-center cursor-pointer h-6"
      >
        {children}
        {copied ? "Copied, thanks ❤️" : "Copy link"}
      </button>
    )
  }

  return null
}

export default CopyButton
