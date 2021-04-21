import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import Reducer from './reducer'

const initialState = {
  unreadMsg: 0,
  newMsg: null
}

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)

  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  )
}

export const Context = createContext(initialState)

Store.propTypes = {
  children: PropTypes.any
}

export default Store
