import React from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'

const validationSchema = yup.object().shape({
  email: yup.string().email().label('Email').trim().required()
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
  const { handleSubmit, control, errors, register } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: data?._id,
      email: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true
  })

  register({ name: 'id' })
  return (
    <Modal
      title={title}
      visible={isShown}
      onClose={onCancel}
      okText={processType === 'create' ? 'Create Company' : 'Save'}
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base font-body leading-7">
        <div className="mb-2">
          {`You are about to invite a user for ${data?.building?.name} - Unit ${data?.name}`}
        </div>
        <div className="font-semibold mb-2">Email Address</div>
        <Controller
          name="email"
          control={control}
          render={({ name, value, onChange }) => (
            <FormInput
              id={name}
              name={name}
              placeholder="Enter resident's email"
              value={value}
              error={errors?.email?.message ?? null}
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
