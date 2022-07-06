import P from 'prop-types'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { useLazyQuery } from '@apollo/client'

import { GET_COMPANY_ROLES } from '../queries'

import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'
import { useEffect, useState } from 'react'

function EditStaffContent({
  form,
  open,
  onCancel,
  onOk,
  loading,
  selectedStaff
}) {
  const { control, errors } = form
  const [getCompanyRoles, { data: companyRoles }] = useLazyQuery(
    GET_COMPANY_ROLES
  )
  const [companyRoleOptions, setcompanyRoleOptions] = useState([])
  const [defaultRole, setDefaultRole] = useState()

  useEffect(() => {
    if (selectedStaff) {
      const { company } = selectedStaff
      if (company && company._id) {
        getCompanyRoles({
          variables: {
            id: company._id,
            status: 'active'
          }
        })
      }
    }
    return () => {}
  }, [selectedStaff])

  useEffect(() => {
    if (companyRoles && companyRoles.getCompanyRoles) {
      setcompanyRoleOptions(
        companyRoles.getCompanyRoles?.map(role => {
          return { label: role.name, value: role._id }
        })
      )
    }
  }, [companyRoles])

  useEffect(() => {
    if (companyRoleOptions) {
      setDefaultRole(
        companyRoleOptions.find(i => i.value === selectedStaff?.companyRoleId)
      )
    }
  }, [companyRoleOptions])

  return (
    <Modal
      title="Edit Staff"
      okText="Edit Staff"
      visible={open}
      onClose={onCancel}
      onCancel={onCancel}
      okButtonProps={{
        loading
      }}
      onOk={onOk}
      width={450}
    >
      <div className="w-full p-4">
        <form>
          <div className="mb-4">
            <p className="font-bold text-base text-gray-500 mb-2">First Name</p>
            <Controller
              name="staffFirstName"
              control={control}
              render={({ name, onChange, value }) => {
                return (
                  <FormInput
                    name={name}
                    onChange={onChange}
                    defaultValue={value}
                    placeholder="Enter staff first name"
                    error={errors?.staffFirstName?.message}
                  />
                )
              }}
            />
          </div>
          <div>
            <p className="font-bold text-base text-gray-500 mb-2">Last Name</p>
            <Controller
              name="staffLastName"
              control={control}
              render={({ name, onChange, value }) => {
                return (
                  <FormInput
                    name={name}
                    onChange={onChange}
                    defaultValue={value}
                    placeholder="Enter staff last name"
                    error={errors?.staffLastName?.message}
                  />
                )
              }}
            />
          </div>
          <div>
            <p className="font-bold text-base text-gray-500 mb-2">Role</p>
            <Controller
              control={control}
              name="staffType"
              defaultValue={defaultRole}
              render={({ name, onChange, value }) => {
                return (
                  <Select
                    name={name}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    menuPortalTarget={document.body}
                    options={companyRoleOptions}
                    onChange={onChange}
                    defaultValue={defaultRole}
                    value={value || defaultRole}
                    error={errors?.staffType?.message}
                    placeholder="Choose Role"
                  />
                )
              }}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

EditStaffContent.propTypes = {
  form: P.object,
  open: P.bool,
  loading: P.bool,
  onOk: P.func,
  onCancel: P.func,
  selectedStaff: P.object
}

export default EditStaffContent
