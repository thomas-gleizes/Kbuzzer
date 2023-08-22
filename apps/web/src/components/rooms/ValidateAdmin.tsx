import { useGlobalContext } from "../../context/global"
import { useState } from "react"

const ValidateAdmin: Component = () => {
  const { isAdmin, answers } = useGlobalContext()

  const [index, setIndex] = useState(0)

  return (
    <div>
      <div></div>
    </div>
  )
}
