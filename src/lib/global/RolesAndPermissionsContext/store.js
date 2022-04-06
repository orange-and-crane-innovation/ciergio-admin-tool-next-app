import React, { createContext, useEffect, useReducer } from 'react'

import { GET_COMPANY_ROLES } from '@app/components/pages/staff/manage-roles/api/_query'
import PropTypes from 'prop-types'
import Reducer from './reducer'
import errorHandler from '@app/utils/errorHandler'
import { getCompanySettings } from '@app/components/pages/properties/settings_b/_query'
import { useQuery } from '@apollo/client'

const defaultState = {
  loading: false,
  permissions: [],
  error: false,
  roles: []
}

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

export const Context = createContext(defaultState)

const RolesPermissionStore = ({ children }) => {
  const profile =
    typeof window !== 'undefined' ? localStorage.getItem('profile') : null
  const user = JSON.parse(profile)
  const companyID = user?.accounts?.data[0]?.company?._id
  // companyRoleId
  const companyRoleId = user?.accounts?.data[0]?.companyRoleId

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

  const [state, dispatch] = useReducer(Reducer, defaultState)

  useEffect(() => {
    if (loading && loadingCompanyRoles) {
      dispatch({ type: 'LOADING_ROLES_PERMISSIONS' })
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

      // now we will compare the roles and permissions

      console.log({ temp, a: getCompanySettings?.subscriptionModules })
      dispatch({
        type: 'LOADED_ROLES_PERMISSIONS',
        payload: {
          permissions: getCompanySettings?.subscriptionModules,
          roles: temp
        }
      })
    }

    if (error && errorCompanyRoles) {
      dispatch({
        type: 'FAILED_ROLES_PERMISSIONS'
      })
      errorHandler(error)
    }
  }, [
    loading,
    data,
    error,
    loadingCompanyRoles,
    dataCompanyRoles,
    errorCompanyRoles,
    companyRoleId
  ])

  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  )
}

RolesPermissionStore.propTypes = {
  children: PropTypes.any
}

export default RolesPermissionStore
