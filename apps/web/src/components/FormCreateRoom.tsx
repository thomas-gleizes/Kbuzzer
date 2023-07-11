import { SubmitHandler, useForm } from "react-hook-form"
import { api } from "../utils/api"
import { css } from "../../styled-system/css"

interface Values {
  username: string
}

export const FormCreateRoom = () => {
  const { register, handleSubmit } = useForm<Values>({ defaultValues: { username: "kalat" } })

  const onSubmit: SubmitHandler<Values> = async (data) => {
    const response = await api.post("/room", { username: data.username })

    console.log("Response", response)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1
          className={css({ textAlign: "center", mb: 5, fontSize: "3xl", fontWeight: "semibold" })}
        >
          Crée une session
        </h1>

        <div>
          <label>Nom : </label>
          <input
            {...register("username")}
            type="text"
            className={css({ outline: "none", px: 3, py: 2, fontSize: "lg", rounded: "md" })}
          />
        </div>
        <div>
          <button
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
              _hover: {
                shadow: "xl",
              },
            })}
            type="submit"
          >
            Rejoindre
          </button>
        </div>
      </form>
    </div>
  )
}
