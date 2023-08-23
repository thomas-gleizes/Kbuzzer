import { ChangeEventHandler, FocusEventHandler, useState } from "react"

import { useGlobalContext } from "context/global"

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
    <div>
      <div>
        <label>Limit de temps</label>
        <input
          value={values.timeLimit}
          name="timeLimit"
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <button onClick={handleSubmit}>Enregistrer</button>
    </div>
  )
}
