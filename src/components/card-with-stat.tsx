import React, { PropsWithChildren, ReactNode } from "react"

interface Props {
  title: string
  href: string
  stat: ReactNode
}

export const CardWithStat = ({
  title,
  href,
  stat,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <a
      href={href}
      className="relative border p-5 shadow-xl hover:shadow-xl rounded-lg hover:rotate-1 hover:skew-y-2 transition-all text-primary"
    >
      <h3 className="m-0">{stat}</h3> <p className="text-xs mb-3">{title}</p>
      {children}
    </a>
  )
}
