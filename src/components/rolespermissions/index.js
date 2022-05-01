import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import { useQuery } from '@apollo/client'
import PageLoader from '@app/components/page-loader'
import { getCompanySettings } from '@app/components/pages/properties/settings_b/_query'
import { ACCESSLEVEL } from '@app/constants'
import NotFound from '@app/pages/404'
import errorHandler from '@app/utils/errorHandler'

const isPermitted = (rolespermissions, role) => {
  const { roles } = rolespermissions

  if (isEmpty(roles)) {
    return false
  }

  const isRoleExist = roles.find(r => r?.group === role)

  if (isRoleExist) {
    if (isRoleExist.accessLevel === ACCESSLEVEL.NONE) {
      return false
    }

    return true
  }

  return false
}

const isAllowedModule = (rolespermissions, permission) => {
  const { permissions } = rolespermissions
  if (isEmpty(permissions)) {
    return false
  }
  const moduleChecker = permissions[permission]
  if (moduleChecker !== undefined) {
    if (moduleChecker.enable !== undefined) {
      return moduleChecker.enable
    }

    return true
  }

  return false
}

const RolesPermissions = ({ permission, roleName, children, no, text }) => {
  const profile =
    typeof window !== 'undefined' ? localStorage.getItem('profile') : null
  const user = JSON.parse(profile)
  const companyID = user?.accounts?.data[0]?.company?._id
  const accountType = user?.accounts?.data[0]?.accountType
  const userCompanyRole = user?.accounts?.data[0]?.companyRole

  const [rolespermissions, setRolesPermissions] = useState({})
  const [loadingRoles, setLoadingRoles] = useState(false)

  const MODULES = process.env.NEXT_PUBLIC_MODULES
  const isSuperAdmin = accountType === 'administrator'

  // Get company Setting query
  const { loading, data, error } = useQuery(getCompanySettings, {
    variables: {
      where: {
        companyId: companyID
      }
    }
  })

  useEffect(() => {
    if (!isSuperAdmin) {
      if (loading) {
        setLoadingRoles(true)
      }

      if (!loading && data) {
        const { getCompanySettings } = data
        const payload = {
          permissions: getCompanySettings?.subscriptionModules,
          roles: userCompanyRole?.permissions
        }

        console.log('<++++++++++++++++>')
        console.log('TEXT', text)
        console.log('PERMISSION', permission)
        console.log('ROLENAME', roleName)
        console.log('USER PERMISSIONS', userCompanyRole?.permissions)
        console.log('COMPANYSETTINGS', getCompanySettings?.subscriptionModules)
        console.log(
          'SHOULD SHOWWWWW 1',
          isPermitted(rolespermissions, roleName)
        )
        console.log(
          'SHOULD SHOWWWWW 2',
          isAllowedModule(rolespermissions, permission)
        )
        console.log('<++++++++++++++++>')
        setRolesPermissions(payload)
        setLoadingRoles(false)
      }

      if (error) {
        errorHandler(error)
        setLoadingRoles(false)
      }
    } else {
      if (MODULES) {
        const roles = MODULES.split(',').map(module => ({
          group: module.trim(),
          accessLevel: 'administer'
        }))

        const permissions = {}

        MODULES.split(',').forEach(module => {
          permissions[`${module.trim()}`] = {
            enabled: true
          }
        })

        const payload = {
          roles,
          permissions
        }
        setRolesPermissions(payload)
      }
    }
  }, [loading, data])

  if (loadingRoles) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <PageLoader />
      </div>
    )
  }

  if (isPermitted(rolespermissions, roleName) && !loadingRoles) {
    return children
  }

  if (permission === null && roleName === null && !loadingRoles) {
    return no
  }

  return isPermitted(rolespermissions, roleName) ||
    isAllowedModule(rolespermissions, permission)
    ? children
    : null
}

const PageNotRestricted = () => (
  <div className="w-full flex justify-center mt-10">
    <NotFound />
  </div>
)

RolesPermissions.defaultProps = {
  no: <PageNotRestricted />,
  permission: null,
  roleName: null
}

RolesPermissions.propTypes = {
  text: PropTypes.string,
  permission: PropTypes.string,
  roleName: PropTypes.string,
  children: PropTypes.node.isRequired,
  no: PropTypes.node
}

export { RolesPermissions }
