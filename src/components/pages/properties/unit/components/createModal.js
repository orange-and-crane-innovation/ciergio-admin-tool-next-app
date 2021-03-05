import React from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Modal from '@app/components/modal'

const validationSchema = yup.object().shape({
  firstName: yup.string().label('First Name').nullable().required(),
  lastName: yup.string().label('Last Name').nullable().required(),
  email: yup.string().email().label('Email').nullable().trim().required(),
  relation: yup.string().ensure().label('Relationship').required()
})

const Component = ({
  title,
  data,
  loading,
  relationshipTypes,
  isShown,
  onSave,
  onCancel
}) => {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: null,
      relation: ''
    }
  })

  return (
    <Modal
      title={title}
      visible={isShown}
      onClose={onCancel}
      okText="Send Request"
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base font-body leading-7">
        <div className="font-black mb-2">Unit Details</div>
        <div className="font-semibold mb-2">Unit Number</div>
        <Controller
          name="unitName"
          control={control}
          render={({ name, value, onChange }) => (
            <FormInput
              id={name}
              name={name}
              placeholder="Enter Unit Number"
              value={data?.name}
              error={errors?.unitName?.message ?? null}
              onChange={onChange}
            />
          )}
        />

        <div className="font-black mt-8 mb-2">About the Resident</div>
        <div className="flex flex-col md:flex-row">
          <span className="mr-2 w-full md:w-1/2">
            <div className="font-semibold mb-2">First Name</div>
            <Controller
              name="firstName"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  id={name}
                  name={name}
                  placeholder="Enter resident first name"
                  value={value}
                  error={errors?.firstName?.message ?? null}
                  onChange={onChange}
                />
              )}
            />
          </span>
          <span className="w-full md:w-1/2">
            <div className="font-semibold mb-2">Last Name</div>
            <Controller
              name="lastName"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  id={name}
                  name={name}
                  placeholder="Enter resident last name"
                  value={value}
                  error={errors?.lastName?.message ?? null}
                  onChange={onChange}
                />
              )}
            />
          </span>
        </div>

        <div className="font-semibold mb-2">Email Address</div>
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

        <div className="font-semibold mb-2">Relationship</div>
        <Controller
          name="relation"
          control={control}
          render={({ name, value, onChange }) => (
            <FormSelect
              id={name}
              name={name}
              options={relationshipTypes}
              onChange={e => {
                onChange(e.value)
              }}
              value={value}
              error={errors?.relation?.message ?? null}
              isClearable
            />
          )}
        />
      </div>
    </Modal>
  )
}

Component.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
  loading: PropTypes.bool,
  relationshipTypes: PropTypes.array,
  isShown: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
}

export default Component
