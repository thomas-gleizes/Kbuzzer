import { SubmitHandler, useForm } from "react-hook-form"
import { useGlobalContext } from "../context/global"
import { css } from "../../styled-system/css"

interface Values {
  username: string
  code: string
}

export const FormJoinRoom = () => {
  const { register, handleSubmit } = useForm<Values>({
    defaultValues: { username: "", code: "" },
  })

  const { connect } = useGlobalContext()

  const onSubmit: SubmitHandler<Values> = (data) => {
    connect(data.code, data.username)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className={css({ textAlign: "center", mb: 5, fontSize: "3xl", fontWeight: "semibold" })}>
        Rejoindre une session
      </h1>
      <div className={css({ display: "flex", flexDir: "column", mb: "2" })}>
        <label>Code session : </label>
        <input
          {...register("code")}
          type="text"
          className={css({
            outline: "none",
            px: 3,
            py: 2,
            fontSize: "lg",
            rounded: "md",
            borderWidth: "2px",
            borderColor: "purple.500",
            _active: { borderWidth: "2px" },
          })}
        />
      </div>
      <div className={css({ display: "flex", flexDir: "column", mb: "2" })}>
        <label>Nom : </label>
        <input
          {...register("username")}
          type="text"
          className={css({
            outline: "none",
            px: 3,
            py: 2,
            fontSize: "lg",
            rounded: "md",
            borderWidth: "2px",
            borderColor: "purple.500",
            _active: { borderWidth: "2px" },
          })}
        />
      </div>
      <div>
        <button
          type="submit"
          className={css({
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
          })}
        >
          Rejoindre la session
        </button>
      </div>
    </form>
  )
}
