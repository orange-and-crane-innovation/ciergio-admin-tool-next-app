import React, { useEffect } from 'react'
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
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      id: data?._id
    }
  })

  useEffect(() => {
    if (data) {
      register({ name: 'id' })
      setValue('id', data?._id)
    }
  }, [])

  return (
    <Modal
      title={title}
      visible={isShown}
      onClose={onCancel}
      okText="Yes, remove resident"
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
      okButtonProps={{
        disabled: true
      }}
    >
      <div className="p-2 text-base font-body leading-7">
        <p>
          <strong>Warning: </strong>
          {`You're about to remove `}
          <strong>
            {data?.firstName} {data?.lastName}
          </strong>{' '}
          from <strong>Unit {data?.unit?.name}</strong>.
        </p>
        <div className="bg-neutral-100 px-12 py-4 -mx-6 mb-4">
          <ul className="list-disc">
            <li>Profile will be removed from the unit.</li>
            <li>This user won’t be able to access this unit from their app.</li>
            <li>
              Messages, tickets, comments, and notes created by this user will
              still be viewable.
            </li>
          </ul>
        </div>
        <p>
          Are you sure you want to remove{' '}
          <strong>
            {data?.firstName} {data?.lastName}
          </strong>{' '}
          from this unit?
        </p>
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
