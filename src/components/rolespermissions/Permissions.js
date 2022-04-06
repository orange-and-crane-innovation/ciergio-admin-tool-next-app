import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'

const isAllowed = (rolespermissions, permission) => {
  const { permissions } = rolespermissions

  if (isEmpty(permissions)) {
    console.log("ERROR: one of the provided params don't exist!")
    return false
  }
  const checkPermission = permissions[permission]
  if (checkPermission !== undefined) {
    // check if the permission has enable props if no return default on
    if (checkPermission.enable !== undefined) {
      return checkPermission.enable
    }

    return true
  }

  return false
}
const Permissions = ({ permission, rolespermissions, children, no }) => {
  const isAllowedPermission = isAllowed(rolespermissions, permission)

  // if permission is empty string or default means the permission is not supplied
  if (permission === null) {
    return children
  } else {
    return isAllowedPermission && children
  }
}

Permissions.defaultProps = {
  no: null,
  permission: null
}

Permissions.propTypes = {
  permission: PropTypes.string,
  children: PropTypes.node.isRequired,
  no: PropTypes.node
}

export default Permissions
