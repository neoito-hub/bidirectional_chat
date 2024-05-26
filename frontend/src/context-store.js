/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */

import React, { createContext, useState, useContext } from 'react'

const ContextStore = createContext()

const ContextProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null)

  const updateUserDetails = (data) => {
    setUserDetails(data)
  }

  return (
    <ContextStore.Provider value={{userDetails, updateUserDetails}}>
      {children}
    </ContextStore.Provider>
  )
}

const useContextStore = () => useContext(ContextStore)

export { ContextProvider, useContextStore }
