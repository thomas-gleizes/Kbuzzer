import { css } from "../../styled-system/css"

export const NotFound = () => {
  return (
    <div
      className={css({
        h: "full",
        w: "full",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <div className={css({ textAlign: "center" })}>
        <h1 className={css({ fontSize: "2xl", mb: 2 })}>Page not found</h1>
      </div>
    </div>
  )
}
