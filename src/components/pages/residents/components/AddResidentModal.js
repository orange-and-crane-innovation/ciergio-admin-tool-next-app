import React from 'react'
import P from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import Modal from '@app/components/modal'
import validationSchema from '../schema'

import AddResidentModalContent from './AddResidentModalContent'

function AddResidentModal({ showModal, onShowModal }) {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      unit_number: '',
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
      title="Add Resident"
      okText="Add Resident"
      visible={showModal}
      onClose={handleClearModal}
      onCancel={handleClearModal}
      onOk={handleSubmit(handleOk)}
    >
      <AddResidentModalContent form={{ control, errors }} />
    </Modal>
  )
}

AddResidentModal.propTypes = {
  showModal: P.bool,
  onShowModal: P.func
}

export default AddResidentModal
