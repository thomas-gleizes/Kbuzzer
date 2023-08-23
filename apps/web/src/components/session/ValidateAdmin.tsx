import { useState } from "react"

import { useGlobalContext } from "context/global"

const ValidateAdmin: Component = () => {
  const { isAdmin, answers } = useGlobalContext()

  const [index, setIndex] = useState(0)

  return (
    <div>
      <div></div>
    </div>
  )
}
