import { SubmitHandler, useForm } from "react-hook-form"
import { api } from "../../utils/api"
import { css } from "../../../styled-system/css"
import { useGlobalContext } from "../../context/global"
import { toast } from "react-toastify"

interface Values {
  username: string
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
  container: css({
    display: "flex",
    flexDir: "column",
    mb: "2",
  }),
}

export const FormCreateRoom: Component = () => {
  const { connect, username } = useGlobalContext()

  const { register, handleSubmit } = useForm<Values>({
    defaultValues: { username: username ?? "" },
  })

  const onSubmit: SubmitHandler<Values> = async (data) => {
    try {
      const response = await api.post("/room", { username: data.username })

      connect(response.data.id, data.username)
    } catch (err) {
      if (typeof err === "object" && err && err.hasOwnProperty("data")) {
        // @ts-ignore
        return toast.error(err.data.error)
      }

      return toast.error("Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.heading}>Crée une session</h1>

      <div className={styles.container}>
        <label>Nom : </label>
        <input {...register("username")} type="text" className={styles.input} />
      </div>
      <div>
        <button type="submit" className={styles.button}>
          Crée la session
        </button>
      </div>
    </form>
  )
}
