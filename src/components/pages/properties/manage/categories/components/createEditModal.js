import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'

const validationSchema = yup.object().shape({
  name: yup.string().label('Category Name').nullable().trim().required()
})

const Component = ({
  processType,
  categoryType,
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
      id: '',
      name: '',
      type: 'post'
    }
  })

  useEffect(() => {
    register({ name: 'type' })
    setValue('type', categoryType)
  }, [categoryType])

  useEffect(() => {
    if (data) {
      register({ name: 'id' })
      setValue('id', data._id)
      setValue('name', data.name)
    }
  }, [])

  return (
    <Modal
      title={title}
      visible={isShown}
      onClose={onCancel}
      okText="Save"
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base leading-7">
        <div className="font-bold mb-2">Category Name</div>
        <div className="mb-2">
          <Controller
            name="name"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                id={name}
                name={name}
                placeholder="Enter category name"
                value={value}
                error={errors?.name?.message ?? null}
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
  processType: PropTypes.string.isRequired,
  categoryType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
  loading: PropTypes.bool,
  isShown: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
}

export default Component
