import React from 'react'
import PropTypes from 'prop-types'
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
  return (
    <Modal
      title={title}
      visible={isShown}
      onClose={onCancel}
      okText="Yes, delete company"
      onOk={onSave}
      onCancel={onCancel}
    >
      <div className="p-2 text-base font-body leading-7">
        <p>
          <strong>Warning: </strong>
          {`You're about to permanently delete `}
          <strong>{data?.name}</strong>
          {` and all its data, staff, and residents. You can't undo this action.`}
        </p>
        <p>
          Are you sure you want to delete <strong>{data?.name}</strong>?
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
