import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"

import { css } from "styled-system/css"
import { center } from "styled-system/patterns"
import { useGlobalContext } from "context/global"
import { Button, Input, InputGroup, Label } from "components/ui"

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

      <InputGroup>
        <Label>Code session : </Label>
        <Input {...register("code")} type="text" />
      </InputGroup>

      <InputGroup>
        <Label>Nom : </Label>
        <Input {...register("username")} type="text" />
      </InputGroup>

      <div className={center()}>
        <Button type="submit">Rejoindre la session</Button>
      </div>
    </form>
  )
}
