import { css } from "../../../styled-system/css"
import { useState } from "react"
import { useGlobalContext } from "../../context/global"
import { useEvent, useMount } from "react-use"
import { ExpireIn } from "./ExpireIn"

const styles = {
  input: css({
    px: 3,
    py: 1,
  }),
}

export const Answer: Component = () => {
  const { sendMessage, handleSocketMessage, expireAt } = useGlobalContext()

  const [value, setValue] = useState("")
  const [statics, setStatics] = useState({ total: 0, you: 0 })

  const handleValid = () => {
    if (value !== "") sendMessage("answer", { answer: value })
  }

  useEvent("keydown", (event) => {
    if (event.key === "Enter") handleValid()
  })

  useMount(() => {
    handleSocketMessage("new-answer", (data: any) => {
      console.log("Data", data)

      setStatics({ total: data.total, you: data.you })
    })
  })

  console.log("Statics", statics)

  return (
    <div>
      {expireAt && <ExpireIn timestamp={expireAt} />}
      <div>
        <div>
          Réponse: {statics.total} - Position: {statics.you}
        </div>

        <input value={value} onChange={(e) => setValue(e.target.value)} className={styles.input} />
        <button onClick={handleValid}>Validé</button>
      </div>
    </div>
  )
}
