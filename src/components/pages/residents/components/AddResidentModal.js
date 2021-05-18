import React from 'react'
import P from 'prop-types'
import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import showToast from '@app/utils/toast'
import Modal from '@app/components/modal'
import validationSchema from '../schema'
import { INVITE_RESIDENT } from '../queries'
import AddResidentModalContent from './AddResidentModalContent'

function AddResidentModal({ showModal, onShowModal, buildingId, refetch }) {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      unitId: '',
      firstName: '',
      lastName: '',
      relationship: '',
      email: ''
    }
  })
  const [inviteResident, { loading }] = useMutation(INVITE_RESIDENT, {
    onCompleted: () => {
      showToast('success', `Resident invitation sent.`)
      handleShowModal()
      refetch()
    }
  })

  const handleShowModal = () => onShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = async data => {
    try {
      const { unitId, email, firstName, lastName, relationship } = data

      inviteResident({
        variables: {
          data: {
            email,
            firstName,
            lastName,
            relationship: relationship.label,
            type: 'resident'
          },
          unitId: unitId.value
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal
      title="Add Resident"
      okText="Confirm"
      visible={showModal}
      onClose={handleClearModal}
      onCancel={handleClearModal}
      onOk={handleSubmit(handleOk)}
      okButtonProps={{
        loading
      }}
    >
      <AddResidentModalContent
        form={{ control, errors }}
        loading={loading}
        building={buildingId}
      />
    </Modal>
  )
}

AddResidentModal.propTypes = {
  showModal: P.bool,
  onShowModal: P.func,
  buildingId: P.string,
  selectedType: P.string,
  refetch: P.func
}

export default AddResidentModal
