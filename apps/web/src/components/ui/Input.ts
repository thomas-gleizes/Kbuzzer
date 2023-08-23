import { cva } from "../../../styled-system/css"
import { styled } from "../../../styled-system/jsx"

const inputStyle = cva({
  base: {
    outline: "none",
    px: 3,
    py: 2,
    fontSize: "lg",
    rounded: "md",
    borderWidth: "2px",
    borderColor: "purple.500",
    _active: { borderWidth: "2px" },
  },
})

export const Input = styled("input", inputStyle)
