import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'

const validationSchema = yup.object().shape({
  name: yup.string().label('Unit Type Name').nullable().trim().required()
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
  const [unitName, setUnitName] = useState('')
  const { handleSubmit, control, errors, register, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: '',
      name: ''
    }
  })
  useEffect(() => {
    if (data) {
      register({ name: 'id' })
      setValue('id', data._id)
      setValue('name', data.name)
      setUnitName(data.name)
    }
  }, [data])

  return (
    <Modal
      title={title}
      visible={isShown}
      onClose={onCancel}
      okText={processType === 'delete' ? 'Yes, delete unit type' : 'Save'}
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base leading-7">
        {processType === 'delete' ? (
          <>
            <p>
              <strong>Warning: </strong>
              {`You're about to permanently delete a Unit Type. Some building may already used this tag.`}
            </p>
            <br />
            <p>
              {`Are you sure you want to delete `}
              <strong>{unitName}</strong>?
            </p>
          </>
        ) : (
          <>
            <div className="font-bold mb-2">Unit Type</div>
            <div className="mb-2">
              <Controller
                name="name"
                control={control}
                render={({ name, value, onChange }) => (
                  <FormInput
                    id={name}
                    name={name}
                    placeholder="Enter unit type name"
                    value={value}
                    error={errors?.name?.message ?? null}
                    onChange={onChange}
                  />
                )}
              />
            </div>
          </>
        )}
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
