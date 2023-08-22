import { css } from "../../styled-system/css"

const styles = {
  container: css({
    h: "full",
    w: "full",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  content: css({
    textAlign: "center",
  }),
  heading: css({
    fontSize: "2xl",
    mb: 2,
  }),
}

export const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Page not found</h1>
      </div>
    </div>
  )
}
