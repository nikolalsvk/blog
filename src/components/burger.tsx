import React from "react"

interface Props {
  open: boolean
  handleClick: () => void
}

const Burger = ({ open, handleClick }: Props) => {
  return (
    <button
      onClick={handleClick}
      aria-label="Menu"
      className={`
        flex md:hidden flex-col justify-around w-6 h-6 bg-transparent border-none 
        cursor-pointer p-0 z-[21] ${open ? "fixed" : "initial"} right-3 
        focus:outline-none
      `}
    >
      <div
        className={`
        w-6 h-[0.16rem] bg-primary rounded-[10px] transition-all duration-300 
        relative origin-[1px] ${open ? "rotate-[45deg]" : "rotate-0"}
      `}
      />
      <div
        className={`
        w-6 h-[0.16rem] bg-primary rounded-[10px] transition-all duration-300 
        relative origin-[1px] ${
          open ? "opacity-0 translate-x-[-10px]" : "opacity-100 translate-x-0"
        }
      `}
      />
      <div
        className={`
        w-6 h-[0.16rem] bg-primary rounded-[10px] transition-all duration-300 
        relative origin-[1px] ${open ? "rotate-[-45deg]" : "rotate-0"}
      `}
      />
    </button>
  )
}

export default Burger
