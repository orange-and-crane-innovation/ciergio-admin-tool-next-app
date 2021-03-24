import React from 'react'
import Modal from '@app/components/modal'
import P from 'prop-types'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import validationSchema from './schema'

import AddVisitorModalContent from './AddVisitorModalContent'

function AddVisitorModal({ showModal, onShowModal }) {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      unit_number: '',
      unit_owner_name: '',
      first_name: '',
      last_name: '',
      resident_type: '',
      resident_email: ''
    }
  })
  const handleShowModal = () => onShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = () => {
    handleClearModal()
  }
  return (
    <Modal
      title="Add Visitor"
      okText="Add"
      visible={showModal}
      onClose={handleClearModal}
      onCancel={handleClearModal}
      onOk={handleSubmit(handleOk)}
    >
      <AddVisitorModalContent form={{ control, errors }} />
    </Modal>
  )
}

AddVisitorModal.propTypes = {
  showModal: P.bool,
  onShowModal: P.func
}

export default AddVisitorModal
