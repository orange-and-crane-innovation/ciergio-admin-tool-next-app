import React from 'react'
import Modal from '@app/components/modal'
import P from 'prop-types'

import ViewMoreDetailsModal from './ViewMoreDetailsModal'

function AddVisitorModal({ showModal, onShowModal }) {
  const handleShowModal = () => onShowModal(old => !old)
  const handleClearModal = () => {
    handleShowModal()
  }
  return (
    <Modal
      title="Details"
      visible={showModal}
      onClose={handleClearModal}
      onCancel={handleClearModal}
    >
      <ViewMoreDetailsModal />
    </Modal>
  )
}

AddVisitorModal.propTypes = {
  showModal: P.bool,
  onShowModal: P.func
}

export default AddVisitorModal
