import _, { isEmpty, sortBy } from 'lodash'
import { useEffect, useState } from 'react'

import Props from 'prop-types'
import Select from '@app/components/forms/form-select'
import { UPDATE_COMPANY_ROLES } from './api/_query'
import showToast from '@app/utils/toast'
import { useMutation } from '@apollo/client'

const ACCESSLEVEL = [
  {
    value: 'administer',
    label: 'Admin'
  },
  {
    value: 'edit',
    label: 'Editor'
  },
  {
    value: 'view',
    label: 'View'
  },
  {
    value: 'none',
    label: 'No Access'
  }
]

const Header = ({ title, description, icon, classes }) => {
  return (
    <div
      className={`${classes} min-w-3xs flex-1 shrink basis-0 min-h-5xs px-5 pt-4`}
    >
      <div className="flex flex-col h-full items-center content-center">
        <span className={`${icon} text-primary-500 text-l`}></span>
        <span className="text-l font-bold capitalize">{title}</span>
        <p className="text-left text-sm">{description}</p>
      </div>
    </div>
  )
}

const Headers = ({ headers }) => {
  const keys = sortBy(Object.keys(headers), key => key)
  return (
    <div className="flex flex-row">
      <div className="flex flex-row justify-between border-b-2">
        {headers &&
          keys[0] &&
          keys.map((item, idx) => {
            const title = replaceWithSpace(item)
            const description = headers[item]
              ?.map(i => i.displayName)
              .toString()
              .replaceAll(',', ', ')

            return (
              <Header
                classes={(idx + 1) % 2 === 0 && 'bg-gray-300'}
                key={idx}
                title={title}
                description={description}
              />
            )
          })}
      </div>
    </div>
  )
}

const Row = ({ value, classes, onChange, disabled }) => {
  const selectVal = ACCESSLEVEL.find(a => a.value === value?.accessLevel)
  return (
    <>
      <div
        style={{ minHeight: '10px' }}
        className={`${classes} border-b-2 min-w-3xs flex-1 shrink basis-0 p-1 min-h-4xs max-h-4xs`}
      >
        <Select
          disabled={disabled}
          options={ACCESSLEVEL}
          defaultValue={selectVal || ACCESSLEVEL[ACCESSLEVEL.length - 1]}
          value={selectVal || ACCESSLEVEL[ACCESSLEVEL.length - 1]}
          onChange={val =>
            disabled
              ? () => {}
              : onChange({ ...val, id: value?.id, group: value?.group })
          }
        />
      </div>
    </>
  )
}

const Rows = ({ roles, headers }) => {
  const user = JSON.parse(localStorage.getItem('profile'))
  const companyRoleID = user?.accounts?.data[0]?.companyRole?._id
  const companyRoleName = user?.accounts?.data[0]?.companyRole?.name
  const keys = sortBy(Object.keys(headers), key => key)
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
      {isEmpty(headers) || isEmpty(keys) ? (
        <div className="w-full text-center">
          <span>No Data</span>
        </div>
      ) : (
        state &&
        state.map((role, idx) => {
          const isDisabled =
            companyRoleID === role.id && companyRoleName === role.name
          return (
            <div key={idx} className="w-full flex flex-row">
              {keys.map((keyID, ridx) => {
                const val = role.permissions.find(r => r.group === keyID)

                let valueFound

                if (val) {
                  valueFound = { ...val, id: role.id }
                } else {
                  valueFound = {
                    group: keyID,
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
                    disabled={isDisabled}
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

const RolesTable = ({ data, loading, modules }) => {
  const modulesArr = Object.values(modules?.subscriptionModules).filter(
    module =>
      typeof module === 'object' &&
      module !== null &&
      !module.group?.includes('Page')
  )
  const grouped = _.mapValues(_.groupBy(modulesArr, 'group'))

  // Fetch roles
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (!loading && data) {
      const permissionRows = data?.getCompanyRoles.map(getCompanyRole => {
        const keys = sortBy(Object.keys(grouped), key => key)
        const temp = keys.map(key => {
          const isExist = getCompanyRole.permissions.find(
            crole => crole.group === key
          )

          if (isExist) {
            return isExist
          } else {
            return {
              group: key,
              accessLevel: 'none'
            }
          }
        })

        return {
          id: getCompanyRole._id,
          name: getCompanyRole.name,
          permissions: temp
        }
      })

      setRows(permissionRows)
    }
  }, [loading, data])

  return (
    <div className="flex flex-col border-t-2 border-l-2 border-r-2 p-0 m-0 flex-nowrap overflow-x-auto">
      <Headers headers={grouped} />
      <Rows roles={rows} headers={grouped} />
    </div>
  )
}

RolesTable.propTypes = {
  data: Props.array,
  loading: Props.bool,
  modules: Props.object
}

Header.propTypes = {
  title: Props.string.isRequired,
  description: Props.string.isRequired,
  icon: Props.string.isRequired,
  classes: Props.string
}

Headers.propTypes = {
  headers: Props.object
}

Row.propTypes = {
  value: Props.string,
  classes: Props.string,
  onChange: Props.func,
  disabled: Props.bool
}

Rows.propTypes = {
  roles: Props.array.isRequired,
  headers: Props.object
}

export default RolesTable
