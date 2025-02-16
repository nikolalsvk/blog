import React from "react"

const VisuallyHidden = ({
  children,
  ...delegated
}: {
  children: JSX.Element | string
}) => {
  const [forceShow, setForceShow] = React.useState(false)

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "Alt") {
          setForceShow(true)
        }
      }

      const handleKeyUp = () => {
        setForceShow(false)
      }

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)

      return () => {
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [])

  if (forceShow) {
    return <>{children}</>
  }

  return (
    <div
      className="absolute overflow-hidden h-[1px] w-[1px] m-[-1px] p-0 border-0 [clip:rect(0_0_0_0)]"
      {...delegated}
    >
      {children}
    </div>
  )
}

export default VisuallyHidden
