import React, { createContext, useContext } from "react"

const GlobalContext = createContext<any>({})

export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>
}
