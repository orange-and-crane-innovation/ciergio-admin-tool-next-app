import Roles, { isAllowedRole } from './Roles'
import { useEffect, useState } from 'react'

import { GET_COMPANY_ROLES } from '@app/components/pages/staff/manage-roles/api/_query'
import NotFound from '@app/pages/404'
import PageLoader from '@app/components/page-loader'
import Permissions from './Permissions'
import PropTypes from 'prop-types'
import errorHandler from '@app/utils/errorHandler'
import { getCompanySettings } from '@app/components/pages/properties/settings_b/_query'
import isEmpty from 'lodash/isEmpty'
import { useQuery } from '@apollo/client'

const PermissionGroups = [
  {
    group: 'accounts',
    accessLevel: 'none'
  },
  {
    group: 'messaging',
    accessLevel: 'none'
  },
  {
    group: 'registry',
    accessLevel: 'none'
  },
  {
    group: 'post',
    accessLevel: 'none'
  },
  {
    group: 'engagements',
    accessLevel: 'none'
  },
  {
    group: 'issues',
    accessLevel: 'none'
  },
  {
    group: 'dues',
    accessLevel: 'none'
  },
  {
    group: 'incident_reports',
    accessLevel: 'none'
  },
  {
    group: 'notifications',
    accessLevel: 'none'
  },
  {
    group: 'payments',
    accessLevel: 'none'
  }
]

const RolesPermissions = ({ permission, roleName, children, no }) => {
  const profile =
    typeof window !== 'undefined' ? localStorage.getItem('profile') : null
  const user = JSON.parse(profile)
  const companyID = user?.accounts?.data[0]?.company?._id
  const accountType = user?.accounts?.data[0]?.accountType
  // companyRoleId
  const companyRoleId = user?.accounts?.data[0]?.companyRoleId

  const [rolespermissions, setRolesPermissions] = useState({})
  const [loadingRoles, setLoadingRoles] = useState(false)

  const MODULES = process.env.NEXT_PUBLIC_MODULES
  const isSuperAdmin = accountType === 'administrator'

  const { loading, data, error } = useQuery(getCompanySettings, {
    variables: {
      where: {
        companyId: companyID
      }
    }
  })

  const {
    loading: loadingCompanyRoles,
    data: dataCompanyRoles,
    error: errorCompanyRoles
  } = useQuery(GET_COMPANY_ROLES, {
    variables: {
      where: {
        companyId: companyID
      }
    }
  })

  useEffect(() => {
    if (!isSuperAdmin) {
      if (loading && loadingCompanyRoles) {
        setLoadingRoles(true)
      }

      if (!loading && data && !loadingCompanyRoles && dataCompanyRoles) {
        const { getCompanySettings } = data
        const { getCompanyRoles } = dataCompanyRoles

        const userCompanyRole = getCompanyRoles?.find(
          getCompanyRole => getCompanyRole._id === companyRoleId
        )

        // loading the default permissions
        const temp = PermissionGroups.map(permissionGroup => {
          const isExist = userCompanyRole?.permissions.find(
            crole => crole.group === permissionGroup.group
          )

          return isExist
            ? {
                group: isExist?.group,
                accessLevel: isExist?.accessLevel
              }
            : permissionGroup
        })
        const payload = {
          permissions: getCompanySettings?.subscriptionModules,
          roles: temp
        }

        // now we will compare the roles and permissions
        setRolesPermissions(payload)
        setLoadingRoles(false)
      }

      if (error && errorCompanyRoles) {
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
  }, [
    loading,
    data,
    error,
    loadingCompanyRoles,
    dataCompanyRoles,
    errorCompanyRoles,
    companyRoleId,
    isSuperAdmin,
    MODULES
  ])

  // we can make a shortcut here, if the role is allowed we can render even not checking the permission
  const roleAllowed =
    !loadingRoles &&
    !isEmpty(rolespermissions) &&
    isAllowedRole(rolespermissions, roleName)

  if (loadingRoles) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <PageLoader />
      </div>
    )
  }

  if (roleAllowed && !loadingRoles) {
    return children
  }

  if (permission === null && roleName === null && !loadingRoles) {
    return no
  }

  // we will first check the role of the user then after check if it has permission
  return (
    <Roles role={roleName} no={no} rolespermissions={rolespermissions}>
      <Permissions
        no={no}
        permission={permission}
        rolespermissions={rolespermissions}
      >
        {children}
      </Permissions>
    </Roles>
  )
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
  permission: PropTypes.string,
  roleName: PropTypes.string,
  children: PropTypes.node.isRequired,
  no: PropTypes.node
}

export { RolesPermissions }
