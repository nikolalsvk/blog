import React, { useState } from "react"
import { Link } from "gatsby"
import ThemeSwitch from "./theme-switch"
import Burger from "./burger"

interface MobileMenuProps {
  open: boolean
}

const MobileMenu = ({ open }: MobileMenuProps) => {
  return (
    <div
      className={`md:hidden z-20 flex w-full h-full flex-col justify-center items-center fixed top-0 left-0 bg-[var(--color-background)] transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav className="flex flex-col justify-center items-center">
        <Link
          className="text-2xl mb-4 shadow-none hover:shadow-[0_1px_0_0_currentColor]"
          to="/about"
        >
          About
        </Link>
        <Link
          className="text-2xl mb-4 shadow-none hover:shadow-[0_1px_0_0_currentColor]"
          to="/uses"
        >
          Uses
        </Link>
        <Link
          className="text-2xl mb-4 shadow-none hover:shadow-[0_1px_0_0_currentColor]"
          to="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="text-2xl mb-4 shadow-none hover:shadow-[0_1px_0_0_currentColor]"
          to="/newsletter"
        >
          Newsletter
        </Link>
        <Link
          className="text-2xl mb-4 shadow-none hover:shadow-[0_1px_0_0_currentColor]"
          to="/tags"
        >
          Tags
        </Link>

        <ThemeSwitch />
      </nav>
    </div>
  )
}

interface Props {
  title: string
  showLargeHeader?: boolean
}

const Header = ({ title, showLargeHeader }: Props) => {
  const [open, setOpen] = useState(false)
  const toggleMobileMenu = () => setOpen((value) => !value)

  const navLinkClasses =
    "mr-[18px] no-underline shadow-none hover:shadow-[0_1px_0_0_currentColor] text-[var(--color-text)]"

  if (showLargeHeader) {
    return (
      <header className="mt-0 flex justify-between flex-col mb-4">
        <nav className="justify-between w-full hidden md:flex">
          <div className="flex items-center">
            <Link to="/about" className={navLinkClasses}>
              About
            </Link>
            <Link to="/uses" className={navLinkClasses}>
              Uses
            </Link>
            <Link to="/dashboard" className={navLinkClasses}>
              Dashboard
            </Link>
            <Link to="/newsletter" className={navLinkClasses}>
              Newsletter
            </Link>
            <Link to="/tags" className={navLinkClasses}>
              Tags
            </Link>
          </div>

          <div className="flex">
            <ThemeSwitch />
          </div>
        </nav>

        <MobileMenu open={open} />

        <h1 className="mt-8 text-[4.1rem] flex items-center justify-between">
          <Link
            to="/"
            className={`text-[var(--color-primary)] no-underline shadow-none`}
          >
            {title}
          </Link>
          <Burger open={open} handleClick={toggleMobileMenu} />
        </h1>
      </header>
    )
  }

  return (
    <header className="mt-4 md:mt-0 flex justify-between items-center">
      <h1 className="text-xl my-0">
        <Link
          to="/"
          className={`text-[var(--color-primary)] no-underline shadow-none`}
        >
          {title}
        </Link>
      </h1>

      <MobileMenu open={open} />

      <Burger open={open} handleClick={toggleMobileMenu} />

      <div className="flex items-center hidden md:flex">
        <nav className="flex items-center">
          <Link to="/about" className={navLinkClasses}>
            About
          </Link>
          <Link to="/uses" className={navLinkClasses}>
            Uses
          </Link>
          <Link to="/dashboard" className={navLinkClasses}>
            Dashboard
          </Link>
          <Link to="/newsletter" className={navLinkClasses}>
            Newsletter
          </Link>
          <Link to="/tags" className={navLinkClasses}>
            Tags
          </Link>

          <ThemeSwitch />
        </nav>
      </div>
    </header>
  )
}

export default Header
