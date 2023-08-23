import { cva } from "styled-system/css"
import { styled } from "styled-system/jsx"

const cardStyle = cva({
  base: {
    py: 8,
    px: 5,
    boxShadow: "lg",
    _hover: {
      shadow: "lg",
    },
  },
  variants: {
    color: {
      gray: {
        backgroundGradient: "to-br",
        gradientFrom: "gray.50",
        gradientTo: "stone.50",
      },
    },
    rounded: {
      small: {
        borderRadius: "sm",
      },
      normal: {
        borderRadius: "lg",
      },
      large: {
        borderRadius: "2xl",
      },
    },
  },
  defaultVariants: {
    color: "gray",
    rounded: "normal",
  },
})

export const Card = styled("div", cardStyle)
