import { FormEvent } from "react"

export const FormJoinRoom = () => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    console.log("Event", event)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Rejoindre une session</h1>

      <div>
        <label>Nom : </label>
        <input type="text" name="username" />
      </div>
      <div>
        <label>Code session : </label>
        <input type="text" name="code" />
      </div>
      <div>
        <button type="submit">Rejoindre</button>
      </div>
    </form>
  )
}
