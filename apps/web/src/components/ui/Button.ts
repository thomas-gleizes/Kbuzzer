import { cva } from "styled-system/css"
import { styled } from "styled-system/jsx"

const buttonStyle = cva({
  base: {
    borderRadius: "4px",
    fontWeight: "bold",
    textAlign: "center",
    cursor: "pointer",
    transitionDuration: "200ms",
    shadow: "lg",
    _hover: {
      shadow: "xl",
      scale: "1.03",
    },
  },
  variants: {
    visual: {
      solid: {
        backgroundGradient: "to-bl",
        gradientFrom: "purple.700",
        gradientTo: "blue.700",
        color: "white",
      },
      outline: {
        borderWidth: "1px",
        borderColor: "purple.700",
        backgroundColor: "white",
        color: "purple.700",
        _hover: {
          borderColor: "transparent",
          backgroundGradient: "to-bl",
          gradientFrom: "purple.700",
          gradientTo: "blue.700",
          color: "white",
        },
      },
    },
    size: {
      medium: {
        padding: "8px 16px",
        fontSize: "16px",
      },
      small: {
        fontSize: "14px",
        padding: "4px 8px",
      },
      large: {
        fontSize: "18px",
        padding: "12px 24px",
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
  },
  defaultVariants: {
    size: "medium",
    visual: "solid",
  },
})

export const Button = styled("button", buttonStyle)
