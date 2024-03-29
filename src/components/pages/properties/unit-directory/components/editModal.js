import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Modal from '@app/components/modal'

const validationSchema = yup.object().shape({
  floorNo: yup
    .number()
    .required()
    .positive('Floor number must be greater than zero')
    .integer()
    .label('Floor number')
    .typeError('Floor number must be a number')
    .nullable(),
  unitName: yup.string().label('Unit number').nullable().required(),
  unitType: yup.string().ensure().label('Unit Type').required(),
  unitSize: yup
    .number()
    .positive('Floor Area must be greater than zero')
    .label('Floor Area')
    .typeError('Floor Area must be a number')
    .nullable()
    .required()
})

const Component = ({
  processType,
  title,
  data,
  loading,
  unitTypes,
  isShown,
  onSave,
  onCancel
}) => {
  const { handleSubmit, control, errors, register, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: data?._id,
      floorNo: data?.floorNumber,
      unitName: data?.name,
      unitType: data?.unitType?._id,
      unitSize: data?.unitSize
    }
  })

  useEffect(() => {
    if (data) {
      register({ name: 'id' })
      setValue('id', data?._id)
      setValue('floorNo', data?.floorNumber)
      setValue('unitName', data?.name)
      setValue('unitType', data?.unitType?._id)
      setValue('unitSize', data?.unitSize)
    }
  }, [])

  return (
    <Modal
      title={title}
      visible={isShown}
      onClose={onCancel}
      okText={processType === 'create' ? 'Create Unit' : 'Save'}
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base font-body leading-7">
        <div className="mb-2">
          You are updating a unit for <strong>{data?.name}</strong> in
          <strong> {data?.complex?.name}</strong>
        </div>

        <div className="flex flex-col mt-8 md:flex-row">
          <span className="mr-2">
            <div className="font-semibold mb-2">Floor Number</div>
            <Controller
              name="floorNo"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  id={name}
                  name={name}
                  placeholder="Enter Floor Number"
                  value={value}
                  error={errors?.floorNo?.message ?? null}
                  onChange={onChange}
                />
              )}
            />
          </span>
          <span>
            <div className="font-semibold mb-2">Unit Number</div>
            <Controller
              name="unitName"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  id={name}
                  name={name}
                  placeholder="Enter Unit Number"
                  value={value}
                  error={errors?.unitName?.message ?? null}
                  onChange={onChange}
                />
              )}
            />
          </span>
        </div>

        <div className="flex flex-col md:flex-row">
          <span className="mr-2 w-full md:w-1/2">
            <div className="font-semibold mb-2">Unit Type</div>
            <Controller
              name="unitType"
              control={control}
              render={({ name, value, onChange }) => (
                <FormSelect
                  id={name}
                  name={name}
                  options={unitTypes}
                  onChange={e => {
                    onChange(e.value)
                  }}
                  value={unitTypes?.filter(item => item.value === value)}
                  error={errors?.unitType?.message ?? null}
                />
              )}
            />
          </span>

          <span className="w-full md:w-1/2">
            <div className="font-semibold mb-2">Floor Area</div>
            <Controller
              name="unitSize"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  id={name}
                  name={name}
                  placeholder="Enter Floor Area"
                  value={value}
                  error={errors?.unitSize?.message ?? null}
                  onChange={onChange}
                />
              )}
            />
          </span>
        </div>
      </div>
    </Modal>
  )
}

Component.propTypes = {
  processType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
  loading: PropTypes.bool,
  unitTypes: PropTypes.array,
  isShown: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
}

export default Component
