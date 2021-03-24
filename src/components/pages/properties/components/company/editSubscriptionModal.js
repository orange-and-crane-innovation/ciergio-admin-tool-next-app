import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'

const validationSchema = yup.object().shape({
  complexNo: yup
    .number()
    .positive('No of Complexes must be greater than zero')
    .integer()
    .label('No of Complexes')
    .typeError('No of Complexes must be a number')
    .nullable()
    .required(),
  buildingNo: yup
    .number()
    .positive('No of Complexes must be greater than zero')
    .integer()
    .label('No of Buildings')
    .typeError('No of Buildings must be a number')
    .nullable()
    .required()
})

const EditSubscriptionComponent = ({
  data,
  loading,
  isShown,
  onSave,
  onCancel
}) => {
  const { handleSubmit, control, errors, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      complexNo: data?.complexLimit ?? 0,
      buildingNo: data?.buildingLimit ?? 0
    }
  })

  useEffect(() => {
    if (data) {
      setValue('complexNo', data?.complexLimit ?? 0)
      setValue('buildingNo', data?.buildingLimit ?? 0)
    }
  }, [])

  return (
    <Modal
      title="Edit Subscription"
      visible={isShown}
      onClose={onCancel}
      okText="Save"
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base font-body leading-7">
        <div className="font-black mb-2">Subscription</div>
        <div className="flex flex-col items-start lg:flex-row">
          <div className="mr-4 w-full lg:w-64">
            <div className="font-semibold mb-2">Assign # of Complexes</div>
            <Controller
              name="complexNo"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  id={name}
                  name={name}
                  placeholder="Enter # of complexes"
                  value={value}
                  error={errors?.complexNo?.message ?? null}
                  onChange={onChange}
                />
              )}
            />
          </div>
          <div className="w-full lg:w-64">
            <div className="font-semibold mb-2">Assign # of Buildings</div>
            <Controller
              name="buildingNo"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  id={name}
                  name={name}
                  placeholder="Enter # of buildings"
                  value={value}
                  error={errors?.buildingNo?.message ?? null}
                  onChange={onChange}
                />
              )}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

EditSubscriptionComponent.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  isShown: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
}

export default EditSubscriptionComponent
