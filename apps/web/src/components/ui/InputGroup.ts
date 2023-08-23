import { cva } from "../../../styled-system/css"
import { styled } from "../../../styled-system/jsx"

const inputGroupStyle = cva({
  base: {
    display: "flex",
    flexDir: "column",
    mb: "2",
  },
})

export const InputGroup = styled("div", inputGroupStyle)
