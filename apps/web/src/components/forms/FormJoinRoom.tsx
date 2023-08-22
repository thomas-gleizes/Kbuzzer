import { SubmitHandler, useForm } from "react-hook-form"
import { useGlobalContext } from "../../context/global"
import { css } from "../../../styled-system/css"
import { useSearchParams } from "react-router-dom"

interface Values {
  username: string
  code: string
}

const styles = {
  heading: css({
    textAlign: "center",
    mb: 5,
    fontSize: "3xl",
    fontWeight: "semibold",
  }),
  input: css({
    outline: "none",
    px: 3,
    py: 2,
    fontSize: "lg",
    rounded: "md",
    borderWidth: "2px",
    borderColor: "purple.500",
    _active: { borderWidth: "2px" },
  }),
  container: css({
    display: "flex",
    flexDir: "column",
    mb: "2",
  }),
  button: css({
    backgroundGradient: "to-bl",
    gradientFrom: "purple.700",
    gradientTo: "blue.700",
    color: "white",
    fontSize: "xl",
    rounded: "lg",
    shadow: "lg",
    w: "full",
    py: 1,
    my: 2,
    cursor: "pointer",
    transitionDuration: "100ms",
    _hover: {
      shadow: "xl",
      scale: "1.05",
    },
  }),
}

export const FormJoinRoom = () => {
  const [searchParams] = useSearchParams()
  const { connect, username } = useGlobalContext()

  const { register, handleSubmit } = useForm<Values>({
    defaultValues: { username: username ?? "", code: searchParams.get("code") ?? "" },
  })

  const onSubmit: SubmitHandler<Values> = (data) => {
    connect(data.code, data.username)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.heading}>Rejoindre une session</h1>

      <div className={styles.container}>
        <label>Code session : </label>
        <input {...register("code")} type="text" className={styles.input} />
      </div>

      <div className={styles.container}>
        <label>Nom : </label>
        <input {...register("username")} type="text" className={styles.input} />
      </div>

      <div>
        <button type="submit" className={styles.button}>
          Rejoindre la session
        </button>
      </div>
    </form>
  )
}
