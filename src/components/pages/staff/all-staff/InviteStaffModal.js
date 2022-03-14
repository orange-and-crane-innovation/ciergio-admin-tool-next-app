import { useMemo, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Controller } from 'react-hook-form'
import P from 'prop-types'

import Modal from '@app/components/modal'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import ReactSelect from 'react-select'

import { ACCOUNT_TYPES } from '@app/constants'

import { GET_BUILDINGS, GET_COMPLEXES, GET_COMPANY_ROLES } from '../queries'
import { CREATE_STAFF_ROLES } from '../constants'
import styles from '../staff.module.css'

function InviteStaffModal({
  open,
  onOk,
  loading,
  onCancel,
  form,
  companyOptions
}) {
  const { watch, errors, control } = form

  const staffType = watch('staffType')?.value
  const companyId = watch('company')
  const complexId = watch('complex')
  const isComplex = staffType === ACCOUNT_TYPES.COMPXAD.value
  const isBuilding = staffType === ACCOUNT_TYPES.BUIGAD.value
  const isReceptionist = staffType === ACCOUNT_TYPES.RECEP.value
  const isBrowser = typeof window !== 'undefined'
  const profile = isBrowser && JSON.parse(localStorage.getItem('profile'))
  const accountType = profile?.accounts?.data[0]?.accountType
  const companyID = profile?.accounts?.data[0]?.company?._id
  const complexID = profile?.accounts?.data[0]?.complex?._id

  const [getComplexes, { data: complexes }] = useLazyQuery(GET_COMPLEXES)
  const [getBuildings, { data: buildings }] = useLazyQuery(GET_BUILDINGS)
  const [getCompanyRoles, { data: companyRoles }] = useLazyQuery(
    GET_COMPANY_ROLES
  )

  const [companyRoleOptions, setcompanyRoleOptions] = useState([])
  const [myCompanies, setMyCompanies] = useState(companyOptions)

  useEffect(() => {
    if (accountType === 'company_admin') {
      setMyCompanies([
        {
          label: profile?.accounts?.data[0]?.company?.name,
          value: profile?.accounts?.data[0]?.company?._id
        }
      ])
    }

    return () => {
      setMyCompanies(companyOptions)
    }
  }, [accountType, companyOptions])

  useEffect(() => {
    switch (accountType) {
      case ACCOUNT_TYPES.COMPYAD.value: {
        getComplexes({
          variables: {
            id: companyID
          }
        })

        getCompanyRoles({
          variables: {
            id: companyID
          }
        })
        break
      }
      case ACCOUNT_TYPES.COMPXAD.value: {
        getBuildings({
          variables: {
            id: complexID
          }
        })
        break
      }
    }
  }, [])

  useEffect(() => {
    if (companyId && (isComplex || isBuilding)) {
      getComplexes({
        variables: {
          id: companyId
        }
      })
    }
  }, [companyId, isComplex, isBuilding])

  useEffect(() => {
    if (companyRoles && companyRoles.getCompanyRoles)
      setcompanyRoleOptions(
        companyRoles.getCompanyRoles?.map(role => {
          return { label: role.name, value: role._id }
        })
      )
  }, [companyRoles])

  useEffect(() => {
    if (complexId && isBuilding) {
      getBuildings({
        variables: {
          id: complexId
        }
      })
    }
  }, [isBuilding, complexId])

  const complexOptions = useMemo(() => {
    if (complexes?.getComplexes?.count > 0) {
      return complexes.getComplexes.data.map(complex => ({
        label: complex.name,
        value: complex._id
      }))
    }

    return []
  }, [complexes?.getComplexes?.count])

  const buildingOptions = useMemo(() => {
    if (buildings?.getBuildings?.count > 0) {
      return buildings.getBuildings.data.map(building => ({
        label: building.name,
        value: building._id
      }))
    }

    return []
  }, [buildings?.getBuildings?.count])

  return (
    <Modal
      title="Invite Staff"
      okText="Invite Staff"
      cancelText="Cancel"
      visible={open}
      onClose={onCancel}
      onCancel={onCancel}
      okButtonProps={{
        loading
      }}
      onOk={onOk}
      width={450}
    >
      <div className={styles.inviteStaffContainer}>
        <div className="mb-4">
          <p className="font-bold text-base text-gray-500 mb-2">Staff Email</p>
          <Controller
            name="email"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                placeholder="Enter email of contact"
                type="email"
                name={name}
                onChange={onChange}
                value={value}
                error={errors?.email?.message}
                inputClassName="w-full rounded border-gray-300"
                description={
                  <p className="mb-2">An invite will be sent to this email.</p>
                }
              />
            )}
          />
        </div>
        <div className="mb-4">
          <p className="font-bold text-base text-gray-500 mb-2">
            Role (optional)
          </p>
          <Controller
            control={control}
            name="staffType"
            render={({ name, onChange, value }) => (
              <ReactSelect
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                options={[
                  { name: 'Not Now', value: '' },
                  ...companyRoleOptions
                ]}
                onChange={onChange}
                value={value}
                placeholder="Choose Role"
              />
            )}
          />
        </div>
        <div>
          {accountType === 'company_admin' && (
            <>
              <Controller
                name="company"
                control={control}
                render={({ value, onChange, name }) => (
                  <ReactSelect
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    menuPortalTarget={document.body}
                    options={myCompanies}
                    onChange={onChange}
                    value={value}
                    placeholder={'Select COmpany'}
                  />
                )}
              />
            </>
          )}
          {accountType !== 'company_admin' &&
            accountType !== ACCOUNT_TYPES.BUIGAD.value && (
              <p className="font-bold text-base text-gray-500 mb-2">
                Assign To
              </p>
            )}
          {accountType === ACCOUNT_TYPES.SUP.value && (
            <Controller
              name="company"
              control={control}
              render={({ value, onChange, name }) => (
                <FormSelect
                  name={name}
                  value={
                    companyOptions
                      ? companyOptions.filter(item => item.value === value)
                      : null
                  }
                  onChange={e => onChange(e.value)}
                  options={companyOptions}
                  placeholder="Select a company"
                  error={
                    errors?.company?.message ?? errors?.company?.value?.message
                  }
                  subLabel={<p className="mb-2">Company</p>}
                  containerClasses="mb-4"
                />
              )}
            />
          )}
        </div>
        {accountType !== 'company_admin' && staffType ? (
          <>
            <div>
              {staffType !== ACCOUNT_TYPES.RECEP.value && (
                <>
                  <p className="font-bold text-base text-gray-500 mb-2">
                    Job Title of Point of Contact
                  </p>
                  <Controller
                    name="jobTitle"
                    control={control}
                    render={({ name, value, onChange }) => (
                      <FormInput
                        placeholder="Enter Job Title"
                        name={name}
                        onChange={onChange}
                        value={value}
                        error={errors?.jobTitle?.message}
                        inputClassName="w-full rounded border-gray-300"
                      />
                    )}
                  />
                </>
              )}

              {[ACCOUNT_TYPES.SUP.value, ACCOUNT_TYPES.COMPYAD.value].includes(
                accountType
              ) &&
              (isComplex || isBuilding || isReceptionist) &&
              complexOptions?.length > 0 ? (
                <div>
                  <Controller
                    name="complex"
                    control={control}
                    render={({ value, onChange, name }) => (
                      <FormSelect
                        name={name}
                        value={
                          complexOptions
                            ? complexOptions.filter(
                                item => item.value === value
                              )
                            : null
                        }
                        onChange={e => onChange(e.value)}
                        options={complexOptions}
                        error={
                          errors?.complex?.message ??
                          errors?.complex?.value?.message
                        }
                        subLabel={<p className="mb-2">Complex</p>}
                        placeholder="Select a complex"
                        containerClasses="mb-4"
                      />
                    )}
                  />
                </div>
              ) : null}
              {[
                ACCOUNT_TYPES.SUP.value,
                ACCOUNT_TYPES.COMPYAD.value,
                ACCOUNT_TYPES.COMPXAD.value,
                ACCOUNT_TYPES.BUIGAD.value
              ].includes(accountType) &&
              (isBuilding || isReceptionist) &&
              buildingOptions?.length > 0 ? (
                <Controller
                  name="building"
                  control={control}
                  render={({ value, onChange, name }) => (
                    <FormSelect
                      name={name}
                      value={
                        buildingOptions
                          ? buildingOptions.filter(item => item.value === value)
                          : null
                      }
                      onChange={e => onChange(e.value)}
                      options={buildingOptions}
                      error={errors?.building?.message || undefined}
                      subLabel={<p className="mb-2">Building</p>}
                      placeholder="Select a building"
                    />
                  )}
                />
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  )
}

InviteStaffModal.propTypes = {
  form: P.object,
  onOk: P.func,
  onCancel: P.func,
  open: P.bool,
  loading: P.bool,
  companyOptions: P.array
}

export default InviteStaffModal
