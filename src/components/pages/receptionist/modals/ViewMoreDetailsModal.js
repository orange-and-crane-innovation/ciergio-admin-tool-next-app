import React from 'react'
import Modal from '@app/components/modal'
import P from 'prop-types'

import ViewMoreDetailsModal from './ViewMoreDetailsModal'

function AddVisitorModal({ showModal, onShowModal, handleClearModal }) {
  return (
    <Modal
      title="Details"
      visible={showModal}
      onClose={handleClearModal}
      onCancel={handleClearModal}
      onShowModal={onShowModal}
    >
      <ViewMoreDetailsModal />
    </Modal>
  )
}

AddVisitorModal.propTypes = {
  showModal: P.bool,
  onShowModal: P.func,
  handleClearModal: P.func
}

export default AddVisitorModal
