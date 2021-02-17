import { useState, useMemo } from 'react'
import rules from './rules'

const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE

const check = (type, role, action) => {
  const permissions = rules[type][role].actions

  if (!permissions) {
    console.log("ERROR: one of the provided params don't exist!")
    return false
  }

  if (permissions.includes(action)) {
    return true
  }

  return false
}

const Can = ({ perform, yes, no }) => {
  const [user] = useState(
    JSON.parse(localStorage.getItem('profile')) || undefined
  )

  const profile = useMemo(
    () => ({
      role: user?.accounts?.data[0]?.accountType
    }),
    [user]
  )

  return check(systemType, profile?.role, perform) ? yes : no
}
Can.defaultProps = {
  yes: null,
  no: null
}

export default Can
