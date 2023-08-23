import React, { ChangeEventHandler, FocusEventHandler, useState } from "react"

import { useGlobalContext } from "context/global"
import { Button, Card, Input, InputGroup, Label } from "components/ui"

export const Parameters: Component = () => {
  const { isAdmin, sendMessage } = useGlobalContext()

  const [values, setValues] = useState({ timeLimit: 20 })

  const handleSubmit = () => {
    if (isAdmin) sendMessage("change-parameters", { ...values })
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    sendMessage("change-parameters", { [event.target.name]: event.target.value })
  }

  return (
    <Card>
      <InputGroup>
        <Label>Limit de temps</Label>
        <Input
          value={values.timeLimit}
          name="timeLimit"
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </InputGroup>

      <Button onClick={handleSubmit}>Enregistrer</Button>
    </Card>
  )
}
