import React from 'react'
import P from 'prop-types'
import Modal from '@app/components/modal'

import ViewResidentModalContent from './ViewResidentModalContent'

function ViewResidentModal({ resident, showModal, onShowModal }) {
  const handleShowModal = () => onShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  return (
    <Modal
      title={resident?.full_name}
      visible={showModal}
      onClose={handleClearModal}
      footer={null}
    >
      <ViewResidentModalContent resident={resident} />
    </Modal>
  )
}

ViewResidentModal.propTypes = {
  resident: P.object,
  showModal: P.bool,
  onShowModal: P.func
}

export default ViewResidentModal
