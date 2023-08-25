import React, { ChangeEventHandler, FocusEventHandler, useState } from "react"

import { useGlobalContext } from "context/global"
import { Button, Card, Input, InputGroup, Label } from "components/ui"
import { center, divider } from "../../../styled-system/patterns"
import { css } from "../../../styled-system/css"

const styles = {
  h3: css({
    textAlign: "center",
    fontSize: "2xl",
    fontWeight: "semibold",
  }),
}

export const Parameters: Component = () => {
  const { isAdmin, parameters, sendMessage } = useGlobalContext()

  const [values, setValues] = useState({ ...parameters })

  const handleSubmit = () => {
    if (isAdmin) sendMessage("change-parameters", { ...values })
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  // const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
  //   sendMessage("change-parameters", { [event.target.name]: event.target.value })
  // }

  return (
    <Card className={css({ w: "400px" })}>
      <div>
        <h3 className={styles.h3}>Parameter</h3>
      </div>
      <InputGroup>
        <Label>Limit de temps</Label>
        <Input
          type="number"
          min={5}
          max={60}
          value={values.timeLimit}
          name="timeLimit"
          onChange={handleChange}
          // onBlur={handleBlur}
        />
      </InputGroup>

      <div className={center({ mt: 4 })}>
        <Button type="button" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </div>
    </Card>
  )
}
