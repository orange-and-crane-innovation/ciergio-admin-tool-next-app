import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'

import Modal from '@app/components/modal'

const Component = ({
  processType,
  title,
  data,
  loading,
  isShown,
  onSave,
  onCancel
}) => {
  const { handleSubmit, register } = useForm({
    defaultValues: {
      id: data?.reservee?._id
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
      okText="Yes"
      onOk={handleSubmit(onSave)}
      cancelText="No"
      onCancel={onCancel}
    >
      <div className="p-2 text-base font-body leading-7">
        {`Are you sure you want to cancel invite and remove "`}
        <strong>{data?.reservee?.email}</strong>
        {`" as reservee from `} <strong>{`Unit ${data?.name}`}</strong>
        {`?`}
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
