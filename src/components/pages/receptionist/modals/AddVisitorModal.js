import React from 'react'
import Modal from '@app/components/modal'
import P from 'prop-types'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import validationSchema from './schema'

import AddVisitorModalContent from './AddVisitorModalContent'

function AddVisitorModal({ showModal, onShowModal, buildingId }) {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      unit_number: '',
      host: '',
      date_of_visit: '',
      time_of_visit: '',
      first_name: '',
      last_name: '',
      company: '',
      note: ''
    }
  })
  const handleShowModal = () => onShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  React.useEffect(() => {
    console.log(buildingId)
  }, [])

  return (
    <Modal
      title="Add Visitor"
      okText="Add"
      visible={showModal}
      onClose={handleClearModal}
      onCancel={handleClearModal}
      onOk={handleSubmit(e => console.log(e))}
    >
      <AddVisitorModalContent
        form={{ control, errors }}
        buildingId={buildingId}
      />
    </Modal>
  )
}

AddVisitorModal.propTypes = {
  showModal: P.bool,
  onShowModal: P.func,
  buildingId: P.string
}

export default AddVisitorModal
