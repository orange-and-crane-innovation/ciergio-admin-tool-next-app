import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'

import Modal from '@app/components/modal'
import UpdateCard from './UpdateCard'

const Component = ({
  processType,
  title,
  data,
  loading,
  isShown,
  onSave,
  onCancel
}) => {
  const { handleSubmit } = useForm({
    defaultValues: {
      id: data?.reservee?._id
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true
  })

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
        <UpdateCard type="reinvite" title={`(${data.length}) items`} />
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
