import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'

const ACCESSLEVEL = {
  NONE: 'none',
  ADMINISTER: 'administer',
  EDIT: 'edit',
  VIEW: 'none'
}

export const isAllowedRole = (rolespermissions, role) => {
  const { roles } = rolespermissions

  if (isEmpty(roles)) {
    return false
  }

  const isRoleExist = roles.find(r => r?.group === role)

  if (isRoleExist) {
    //   check if the role is have a permission of none
    if (isRoleExist.accessLevel === ACCESSLEVEL.NONE) {
      return false
    }

    return true
  }

  return false
}

const Roles = ({ rolespermissions, role, children, no }) => {
  const allowed = isAllowedRole(rolespermissions, role)

  //   if role is norole(default) it means no role is provided
  if (role === null) {
    return children
  } else {
    return allowed ? children : no
  }
}

Roles.defaultProps = {
  no: null,
  role: null
}

Roles.propTypes = {
  role: PropTypes.string,
  children: PropTypes.node.isRequired,
  no: PropTypes.node
}

export default Roles
