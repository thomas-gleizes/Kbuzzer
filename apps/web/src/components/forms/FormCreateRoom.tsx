import React from "react"
import { toast } from "react-toastify"
import { SubmitHandler, useForm } from "react-hook-form"

import { center } from "styled-system/patterns"
import { css } from "styled-system/css"
import { api } from "utils/api"
import { useGlobalContext } from "context/global"
import { Button, Input, InputGroup, Label } from "components/ui"

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

      <InputGroup>
        <Label>Nom : </Label>
        <Input {...register("username")} type="text" />
      </InputGroup>

      <div className={center({ py: 2 })}>
        <Button type="submit">Crée la session</Button>
      </div>
    </form>
  )
}
