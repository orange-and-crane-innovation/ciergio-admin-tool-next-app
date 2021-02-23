import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import FormAddress from '@app/components/forms/form-address'
import Modal from '@app/components/modal'

const validationSchema = yup.object().shape({
  name: yup.string().label('Building Name').nullable().trim().required(),
  location: yup.string().label('Location').nullable().trim().required(),
  email: yup.string().email().label('Email').nullable().trim().required(),
  jobtitle: yup.string().label('Job Title').nullable().trim().required()
})

const Component = ({
  processType,
  title,
  data,
  loading,
  isShown,
  onSave,
  onCancel
}) => {
  const { handleSubmit, control, errors, register, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      location: '',
      address: '',
      email: '',
      jobtitle: ''
    }
  })

  useEffect(() => {
    register({ name: 'address' })
    if (data) {
      setValue('name', data?.name)
      setValue('location', data?.address?.formattedAddress)
      setValue('address', data?.address)
      setValue('email', data?.companyAdministrators?.data[0]?.user?.email)
      setValue('jobtitle', data?.companyAdministrators?.data[0]?.user?.jobTitle)
    }
  }, [])

  const getMapValue = e => {
    setValue('location', e?.address?.formattedAddress)
    setValue('address', e?.address)
  }

  return (
    <Modal
      title={title}
      visible={isShown}
      onClose={onCancel}
      okText={processType === 'create' ? 'Create Building' : 'Save'}
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base font-body leading-7">
        <div className="font-black mb-2">About the Building</div>
        <div className="font-semibold mb-2">Name of Building</div>
        <Controller
          name="name"
          control={control}
          render={({ name, value, onChange }) => (
            <FormInput
              id={name}
              name={name}
              placeholder="Enter name of building"
              value={value}
              error={errors?.name?.message ?? null}
              onChange={onChange}
            />
          )}
        />

        <div className="font-semibold mb-2">Location</div>
        <Controller
          name="location"
          control={control}
          render={({ name, value, onChange }) => (
            <FormAddress
              id={name}
              name={name}
              placeholder="Enter building address"
              value={value}
              onChange={onChange}
              error={errors?.location?.message ?? null}
              getValue={getMapValue}
            />
          )}
        />

        <div className="font-black mb-2 mt-10">Point of Contact</div>
        <div className="font-semibold mb-2">Property Manager</div>
        <div className="text-sm mb-2">
          Ciergio invite will be sent to this email
        </div>
        <Controller
          name="email"
          control={control}
          render={({ name, value, onChange }) => (
            <FormInput
              id={name}
              name={name}
              placeholder="Enter email address"
              value={value}
              error={errors?.email?.message ?? null}
              onChange={onChange}
            />
          )}
        />

        <div className="font-semibold mb-2">Job Title of Point of Contact</div>
        <Controller
          name="jobtitle"
          control={control}
          render={({ name, value, onChange }) => (
            <FormInput
              id={name}
              name={name}
              placeholder="Enter job title"
              value={value}
              error={errors?.jobtitle?.message ?? null}
              onChange={onChange}
            />
          )}
        />
      </div>
    </Modal>
  )
}

Component.propTypes = {
  processType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
  loading: PropTypes.bool,
  isShown: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
}

export default Component
