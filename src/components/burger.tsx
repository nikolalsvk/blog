import React from "react"
import styled from "styled-components"

interface StyledBurgerProps {
  open: boolean
}

export const StyledBurger = styled.button<StyledBurgerProps>`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 1.5rem;
  height: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 21;

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    display: flex;
  }

  div {
    width: 1.5rem;
    height: 0.16rem;
    background: var(--color-primary);
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }) => (open ? "rotate(46deg)" : "rotate(0)")};
    }

    :nth-child(2) {
      opacity: ${({ open }) => (open ? "0" : "1")};
      transform: ${({ open }) =>
        open ? "translateX(-10px)" : "translateX(0)"};
    }

    :nth-child(3) {
      transform: ${({ open }) => (open ? "rotate(-46deg)" : "rotate(0)")};
    }
  }
`

interface Props {
  open: boolean
  handleClick: () => void
}

const Burger = ({ open, handleClick }: Props) => {
  return (
    <StyledBurger open={open} onClick={handleClick} aria-label="Menu">
      <div />
      <div />
      <div />
    </StyledBurger>
  )
}

export default Burger
