import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import { useQuery } from '@apollo/client'
import PageLoader from '@app/components/page-loader'
import { getCompanySettings } from '@app/components/pages/properties/settings_b/_query'
import { ACCESSLEVEL } from '@app/constants'
import NotFound from '@app/pages/404'
import errorHandler from '@app/utils/errorHandler'

const isPermitted = (modulespermissions, permission) => {
  const { userPermissions } = modulespermissions

  if (isEmpty(userPermissions)) {
    return false
  }

  const isPermissionExist = userPermissions.find(p => p?.group === permission)

  if (isPermissionExist) {
    if (isPermissionExist.accessLevel === ACCESSLEVEL.NONE) {
      return false
    }
    return true
  }

  return false
}

const isAllowedModule = (modulespermissions, module) => {
  const { companyModules } = modulespermissions
  if (isEmpty(companyModules)) {
    return false
  }
  const moduleChecker = companyModules[module]
  if (moduleChecker !== undefined) {
    if (moduleChecker.enable === undefined) {
      return true
    } else if (moduleChecker.enable !== undefined) {
      return moduleChecker.enable
    }

    return true
  }

  return false
}

const RolesPermissions = ({ moduleName, permissionGroup, children, no }) => {
  const profile =
    typeof window !== 'undefined' ? localStorage.getItem('profile') : null
  const user = JSON.parse(profile)
  const companyID = user?.accounts?.data[0]?.company?._id
  const accountType = user?.accounts?.data[0]?.accountType
  const userCompanyRole = user?.accounts?.data[0]?.companyRole

  const [modulespermissions, setModulesPermissions] = useState({})
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
          companyModules: getCompanySettings?.subscriptionModules,
          userPermissions: userCompanyRole?.permissions
        }
        setModulesPermissions(payload)
        setLoadingRoles(false)
      }

      if (error) {
        errorHandler(error)
        setLoadingRoles(false)
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

  if (moduleName === null && permissionGroup === null && !loadingRoles) {
    return no
  }

  const existOnENV = MODULES.split(', ').includes(moduleName)

  return isSuperAdmin && existOnENV
    ? children
    : existOnENV &&
      isPermitted(modulespermissions, permissionGroup) &&
      isAllowedModule(modulespermissions, moduleName)
    ? children
    : no
}

const PageNotRestricted = () => (
  <div className="w-full flex justify-center mt-10">
    <NotFound />
  </div>
)

RolesPermissions.defaultProps = {
  no: <PageNotRestricted />,
  permissionGroup: null,
  moduleName: null
}

RolesPermissions.propTypes = {
  permissionGroup: PropTypes.string,
  moduleName: PropTypes.string,
  children: PropTypes.node.isRequired,
  no: PropTypes.node
}

export { RolesPermissions }
