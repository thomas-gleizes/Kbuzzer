import { cva } from "../../../styled-system/css"
import { styled } from "../../../styled-system/jsx"

const labelStyle = cva({
  base: {},
})

export const Label = styled("label", labelStyle)
