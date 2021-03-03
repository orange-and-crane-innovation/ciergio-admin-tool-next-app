import rules from './rules'

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

export default check
