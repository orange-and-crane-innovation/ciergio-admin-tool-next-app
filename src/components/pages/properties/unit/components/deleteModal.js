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
      okText="Yes, delete unit"
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base font-body leading-7">
        <p>
          <strong>Warning: </strong>
          {`You're about to delete `}
          <strong>Unit {data?.name}</strong>.
        </p>
        <p>If you delete this unit, it will:</p>
        <div className="bg-neutral-100 px-12 py-4 -mx-6 mb-4">
          <ul className="list-disc">
            <li>Delete the Unit Profile.</li>
            <li>Remove all residents inside this unit.</li>
            <li>{`The residents won’t be able to check the unit from their app.`}</li>
            <li>Messages, dues, and tickets will remain.</li>
          </ul>
        </div>
        <p>
          Are you sure you want to delete Unit <strong>{data?.name}</strong>{' '}
          from <strong>{data?.complexname}</strong>,{' '}
          <strong>{data?.building.name}</strong>?
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
