import React from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'

const validationSchema = yup.object().shape({
  code: yup.string().label('Code').nullable().trim().required()
})

const Component = ({ title, loading, isShown, onSave, onCancel }) => {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      code: ''
    }
  })

  return (
    <Modal
      title={title}
      visible={isShown}
      onClose={onCancel}
      okText="Add Account"
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base leading-7">
        <p>
          To add a new account, request an invite code from your admin
          dashboard.
        </p>
        <div className="font-bold mb-2">Code</div>
        <p>This is the code you receive on your email.</p>
        <div className="mb-2">
          <Controller
            name="code"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                id={name}
                name={name}
                placeholder="Enter the code here"
                value={value}
                error={errors?.code?.message ?? null}
                onChange={onChange}
              />
            )}
          />
        </div>
      </div>
    </Modal>
  )
}

Component.propTypes = {
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  isShown: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
}

export default Component
