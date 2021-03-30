import { useMemo, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Controller } from 'react-hook-form'
import P from 'prop-types'

import Modal from '@app/components/modal'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'

import { GET_BUILDINGS, GET_COMPLEXES } from '../queries'
import { INVITE_STAFF_ROLES } from '../constants'
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
  const companyId = watch('company')?.value
  const complexId = watch('complex')?.value
  const isComplex = staffType === 'complex_admin'
  const isUnit =
    staffType === 'building_admin' ||
    staffType === 'resident' ||
    staffType === 'receptionist' ||
    staffType === 'member'

  useEffect(() => {
    if (companyId && isComplex) {
      getComplexes({
        variables: {
          id: companyId
        }
      })
    }
  }, [companyId, isComplex])

  useEffect(() => {
    if (complexId && isUnit) {
      getBuildings({
        variables: {
          id: complexId
        }
      })
    }
  }, [isUnit, complexId])

  const [getComplexes, { data: complexes }] = useLazyQuery(GET_COMPLEXES)

  const [getBuildings, { data: buildings }] = useLazyQuery(GET_BUILDINGS)

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
  console.log({ errors })
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
        <form>
          <div className="mb-4">
            <p className="font-bold text-base text-gray-500 mb-2">Staff Type</p>
            <Controller
              control={control}
              name="staffType"
              render={({ name, onChange, value }) => (
                <FormSelect
                  name={name}
                  value={value}
                  options={INVITE_STAFF_ROLES}
                  error={
                    errors?.staffType?.message ??
                    errors?.staffType?.value?.message
                  }
                  onChange={onChange}
                  placeholder="Select Staff Type"
                />
              )}
            />
          </div>
          <div className="mb-4">
            <p className="font-bold text-base text-gray-500 mb-2">Email</p>
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
                    <p className="mb-2">
                      An invite will be sent to this email.
                    </p>
                  }
                />
              )}
            />
          </div>
          {staffType !== undefined ? (
            <>
              <div>
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
                <div>
                  <p className="font-bold text-base text-gray-500 mb-2">
                    Assign To
                  </p>
                  <Controller
                    name="company"
                    control={control}
                    render={({ value, onChange, name }) => (
                      <FormSelect
                        name={name}
                        value={value}
                        onChange={onChange}
                        options={companyOptions}
                        placeholder="Select a company"
                        error={
                          errors?.company?.message ??
                          errors?.company?.value?.message
                        }
                        subLabel={<p className="mb-2">Company</p>}
                        containerClasses="mb-4"
                      />
                    )}
                  />
                </div>
                {(isComplex || isUnit) && complexOptions?.length > 0 ? (
                  <div>
                    <Controller
                      name="complex"
                      control={control}
                      render={({ value, onChange, name }) => (
                        <FormSelect
                          name={name}
                          value={value}
                          onChange={onChange}
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
                {isUnit && buildingOptions?.length > 0 ? (
                  <Controller
                    name="building"
                    control={control}
                    render={({ value, onChange, name }) => (
                      <FormSelect
                        name={name}
                        value={value}
                        onChange={onChange}
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
        </form>
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
