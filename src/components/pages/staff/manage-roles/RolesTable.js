import { useEffect, useState } from 'react'

import Props from 'prop-types'
import Select from '@app/components/forms/form-select'
import { UPDATE_COMPANY_ROLES } from './api/_query'
import flatten from 'lodash/flatten'
import isEmpty from 'lodash/isEmpty'
import showToast from '@app/utils/toast'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import { useMutation } from '@apollo/client'

const ACCESSLEVEL = [
  {
    value: 'administer',
    label: 'Admin'
  },
  {
    value: 'edit',
    label: 'Write'
  },
  {
    value: 'view',
    label: 'Read'
  },
  {
    value: 'none',
    label: 'None'
  }
]

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

const Header = ({ title, description, icon, classes }) => {
  return (
    <div
      className={`${classes} min-w-3xs flex-1 shrink basis-0 min-h-5xs px-5`}
    >
      <div className="flex flex-col h-full justify-center items-center">
        <span className={`${icon} text-primary-500 text-l`}></span>
        <span className="text-l font-bold capitalize">{title}</span>
        <p className="text-left">{description}</p>
      </div>
    </div>
  )
}

const Headers = ({ headers }) => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-row justify-between border-b-2">
        {headers &&
          headers.map((header, idx) => (
            <Header
              classes={(idx + 1) % 2 === 0 && 'bg-gray-300'}
              key={idx}
              {...header}
            />
          ))}
      </div>
    </div>
  )
}

const Row = ({ value, classes, onChange }) => {
  const selectVal = ACCESSLEVEL.find(a => a.value === value?.accessLevel)
  return (
    <>
      <div
        style={{ minHeight: '10px' }}
        className={`${classes} border-b-2 min-w-3xs flex-1 shrink basis-0 p-1 min-h-4xs max-h-4xs`}
      >
        <Select
          options={ACCESSLEVEL}
          defaultValue={selectVal || ACCESSLEVEL[ACCESSLEVEL.length - 1]}
          value={selectVal || ACCESSLEVEL[ACCESSLEVEL.length - 1]}
          onChange={val =>
            onChange({ ...val, id: value?.id, group: value?.group })
          }
        />
      </div>
    </>
  )
}

const Rows = ({ roles, headers }) => {
  const [state, setState] = useState([])
  const [tempData, setTempData] = useState([])

  const [updateCompanyRole, { data, called, loading, error }] = useMutation(
    UPDATE_COMPANY_ROLES
  )

  useEffect(() => {
    if (roles) {
      setState(roles)
    }
  }, [roles])

  useEffect(() => {
    if (!loading && data && !error) {
      if (data) {
        showToast('success', 'Permission successfully updated')
        setState(tempData)
      }
    }

    if (!loading && !data && error) {
      showToast('danger', 'Update permission failed')
      setTempData([])
    }
  }, [loading, called, data, error])

  const onChange = val => {
    const foundId = state.find(role => role.id === val.id)
    let tempPermissions = state
    if (foundId) {
      const findPerm = foundId.permissions.find(
        permission => permission.group === val?.group
      )

      if (!findPerm) {
        foundId.permissions.push(val)
        tempPermissions = state.map(stateRole => {
          if (stateRole.id === foundId.id) {
            return foundId
          }

          return stateRole
        })
      }
    }

    const temp = tempPermissions.map(stateRole => {
      if (stateRole.id === val.id) {
        const perm = stateRole.permissions.map(permission => {
          if (permission.group === val?.group) {
            return {
              ...permission,
              group: val?.group,
              accessLevel: val?.value
            }
          }
          return permission
        })

        return { ...stateRole, permissions: perm }
      }
      return stateRole
    })

    setTempData(temp)

    const findPermission = temp.find(t => t.id === val?.id)
    const permissions = findPermission?.permissions.map(permission => ({
      group: permission.group,
      accessLevel: permission.accessLevel
    }))

    updateCompanyRole({
      variables: {
        data: {
          permissions
        },
        companyRoleId: val?.id
      }
    })
  }

  return (
    <>
      {isEmpty(headers) ? (
        <div className="w-full text-center">
          <span>No Data</span>
        </div>
      ) : (
        state &&
        state.map((role, idx) => {
          return (
            <div key={idx} className="w-full flex flex-row">
              {headers.map((header, ridx) => {
                const val = role.permissions.find(
                  r => r.group === header?.title.replace(/ /g, '_')
                )

                let valueFound

                if (val) {
                  valueFound = { ...val, id: role.id }
                } else {
                  valueFound = {
                    group: header?.title,
                    accessLevel: 'none',
                    id: role.id
                  }
                }

                return (
                  <Row
                    key={ridx}
                    value={valueFound}
                    classes={(ridx + 1) % 2 === 0 && 'bg-gray-300'}
                    onChange={onChange}
                  />
                )
              })}
            </div>
          )
        })
      )}
    </>
  )
}

const replaceWithSpace = string => string.replace(/[^a-zA-Z ]/g, ' ')

const RolesTable = ({ data, loading }) => {
  // Fetch roles
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (!loading && data) {
      const existedHeaders = PermissionGroups.map(permissionGroup =>
        replaceWithSpace(permissionGroup.group)
      )
      const permissionHeaders = data?.getCompanyRoles.map(getCompanyRole => {
        const companyRoles = getCompanyRole.permissions.map(permission =>
          replaceWithSpace(permission.group)
        )

        return companyRoles
      })

      const listOfHeaders = [...flatten(permissionHeaders), ...existedHeaders]

      const flattenHeaders = uniq(listOfHeaders)
      const tableHeaders = flattenHeaders.map(flattenHeader => ({
        title: flattenHeader
      }))

      const permissionRows = data?.getCompanyRoles.map(getCompanyRole => {
        const temp = PermissionGroups.map(permissionGroup => {
          const isExist = getCompanyRole.permissions.find(
            crole => crole.group === permissionGroup.group
          )

          if (isExist) {
            return isExist
          } else {
            return permissionGroup
          }
        })

        return {
          id: getCompanyRole._id,
          name: getCompanyRole.name,
          permissions: temp
        }
      })

      setRows(permissionRows)
      setHeaders(sortBy(tableHeaders, tableHeader => tableHeader.title))
    }
  }, [loading, data])

  return (
    <div className="flex flex-col border-t-2 border-l-2 border-r-2 p-0 m-0 flex-nowrap overflow-x-auto">
      <Headers headers={headers} />
      <Rows headers={headers} roles={rows} />
    </div>
  )
}

RolesTable.propTypes = {
  data: Props.array,
  loading: Props.bool
}

Header.propTypes = {
  title: Props.string.isRequired,
  description: Props.string.isRequired,
  icon: Props.string.isRequired,
  classes: Props.string
}

Headers.propTypes = {
  headers: Props.array
}

Row.propTypes = {
  value: Props.string,
  classes: Props.string,
  onChange: Props.func
}

Rows.propTypes = {
  roles: Props.array.isRequired,
  headers: Props.array
}

export default RolesTable
