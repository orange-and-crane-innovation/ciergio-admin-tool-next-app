import React, { useEffect } from 'react'
import Modal from '@app/components/modal'
import P from 'prop-types'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CREATE_REGISTRYRECORD } from '../mutation'
import { useMutation } from '@apollo/client'
import moment from 'moment'
import showToast from '@app/utils/toast'

import validationSchema from './schema'

import AddVisitorModalContent from './AddVisitorModalContent'

function AddVisitorModal({
  showModal,
  onShowModal,
  buildingId,
  categoryId,
  success
}) {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      unit_number: '',
      date_of_visit: '',
      time_of_visit: '',
      first_name: '',
      last_name: '',
      company: '',
      note: ''
    }
  })
  const handleShowModal = () => onShowModal(old => !old)

  const [createRegistryRecord, { loading, called, data }] = useMutation(
    CREATE_REGISTRYRECORD
  )

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = async (data, event) => {
    try {
      const checkInSchedule = data?.time_of_visit
        ? String(moment.utc(data?.time_of_visit).local().format())
        : null
      const checkedInAt = !data?.date_of_visit
        ? String(moment.utc(new Date()).local().format())
        : null

      const company = data.company ? data.company : null

      const createRegisterRecord = {
        categoryId,
        checkedInAt,
        checkInSchedule,
        forWhoId: data.unit_number.value,
        visitor: {
          firstName: data.first_name,
          lastName: data.last_name,
          company
        },
        mediaAttachments: []
      }

      console.log(createRegisterRecord)
      await createRegistryRecord({
        variables: {
          data: createRegisterRecord,
          note: data.note || null
        }
      })

      event.target.reset()
    } catch (e) {
      console.log(e)
      showToast('warning', 'error on creating record')
      success(true)
    }
  }

  useEffect(() => {
    if (!loading && called && data) {
      console.log(data)
      if (data?.createRegistryRecord?.message === 'success') {
        showModal = false
        success(true)
        showToast('success', 'successfully submitted')
      }
    }
  }, [loading, called, data])

  return (
    <Modal
      title="Add Visitor"
      okText="Add"
      visible={showModal}
      onClose={handleClearModal}
      onCancel={handleClearModal}
      onOk={handleSubmit(handleOk)}
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
  buildingId: P.string,
  categoryId: P.string,
  success: P.func
}

export default AddVisitorModal
