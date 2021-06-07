import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import P from 'prop-types'
import moment from 'moment'

import Modal from '@app/components/modal'

import showToast from '@app/utils/toast'
import { toFriendlyTime, toFriendlyDate } from '@app/utils/date'
import errorHandler from '@app/utils/errorHandler'

import validationSchema from './schema'
import { CREATE_REGISTRYRECORD } from '../mutation'

import AddVisitorModalContent from './AddVisitorModalContent'

const singularName = pluralName => {
  const singularName =
    (pluralName === 'Deliveries' && 'Delivery') ||
    (pluralName === 'Pick-ups' && 'Package') ||
    (pluralName === 'Services' && 'Service') ||
    (pluralName === 'Visitors' && 'Visitor')
  return singularName
}
function AddVisitorModal({
  showModal,
  onShowModal,
  buildingId,
  categoryId,
  success,
  refetch,
  name
}) {
  const [uploadImage, setUploadImage] = React.useState(null)
  const [resetForm, setResetForm] = React.useState(false)
  const { handleSubmit, control, errors, reset } = useForm({
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
  const handleShowModal = () => {
    onResetForm()
    onShowModal(old => !old)
  }

  const [createRegistryRecord, { loading, called, data }] = useMutation(
    CREATE_REGISTRYRECORD,
    {
      onError: e => {
        errorHandler(e)
      }
    }
  )

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = data => {
    const time =
      data?.time_of_visit && toFriendlyTime(new Date(data?.time_of_visit))
    const dateOfVisit =
      data?.date_of_visit && toFriendlyDate(new Date(data?.date_of_visit))

    const checkInSchedule =
      time && dateOfVisit
        ? String(moment(dateOfVisit + ' ' + time).format())
        : null

    const checkedInAt = !data?.date_of_visit
      ? String(moment.utc(new Date()).local().format())
      : null

    const company = data.company ? data.company : null

    const createRegisterRecord = {
      categoryId,
      checkedInAt,
      checkInSchedule,
      forWhoId: data.unit_number,
      visitor: {
        firstName: data.first_name,
        lastName: data.last_name,
        company
      },
      mediaAttachments: uploadImage || []
    }

    createRegistryRecord({
      variables: {
        data: createRegisterRecord,
        note: data.note !== '' ? data?.note : null
      }
    })
  }

  const getImage = image => {
    if (image) {
      setUploadImage(image)
    }
  }

  const onResetForm = () => {
    reset()
    setResetForm(prev => !prev)
  }

  useEffect(() => {
    if (!loading && called && data) {
      if (data?.createRegistryRecord?.message === 'success') {
        showModal = false
        success(true)
        showToast('success', `${singularName(name)} Added`)
        setUploadImage(null)
        refetch(true)
        reset({
          company: '',
          date_of_visit: '',
          first_name: '',
          last_name: '',
          note: '',
          time_of_visit: '',
          unit_number: '',
          host: ''
        })
      }
    }
  }, [loading, called, data])

  return (
    <Modal
      title={`Add ${singularName(name) || name}`}
      okText={`Add ${singularName(name)}`}
      visible={showModal}
      onClose={handleClearModal}
      onCancel={handleClearModal}
      onOk={handleSubmit(handleOk)}
    >
      <AddVisitorModalContent
        form={{ control, errors }}
        buildingId={buildingId}
        getImage={getImage}
        type={name}
        reset={resetForm}
      />
    </Modal>
  )
}

AddVisitorModal.propTypes = {
  showModal: P.bool,
  onShowModal: P.func,
  buildingId: P.string,
  categoryId: P.string,
  success: P.func,
  refetch: P.func,
  name: P.string.isRequired
}

export default AddVisitorModal
