import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import FormInput from '@app/components/forms/form-input'
import FormAddress from '@app/components/forms/form-address'
import UploaderImage from '@app/components/uploader/image'
import Modal from '@app/components/modal'

const validationSchema = yup.object().shape({
  logo: yup.array().label('Image').nullable(),
  name: yup.string().label('Company Name').nullable().trim().required(),
  location: yup.string().label('Location').nullable().trim().required()
})

const Component = ({
  processType,
  title,
  data,
  loading,
  isShown,
  onSave,
  onCancel
}) => {
  const [loadingUploader, setLoadingUploader] = useState(false)
  const [imageUrls, setImageUrls] = useState([])

  const { handleSubmit, control, errors, register, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: data?._id ?? '',
      logo: [data?.avatar] ?? [],
      name: data?.name ?? '',
      location: data?.address?.formattedAddress ?? '',
      address: data?.address ?? ''
    }
  })

  useEffect(() => {
    register({ name: 'logo' })
    register({ name: 'address' })
    if (data) {
      register({ name: 'id' })
      setValue('id', data?._id)
      setValue('logo', [data?.avatar] ?? [])
      setValue('name', data?.name ?? '')
      setValue('location', data?.address?.formattedAddress ?? '')
      setValue('address', data?.address ?? '')
      setImageUrls(data?.avatar ? [data?.avatar] : [])
    }
  }, [])

  const uploadApi = async payload => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_UPLOAD_API,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    if (response.data) {
      const imageData = response.data.map(item => {
        return item.location
      })
      setValue('logo', imageData)
    }
  }

  const onUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      setLoadingUploader(true)
      for (const file of files) {
        const reader = new FileReader()

        reader.onloadend = () => {
          setImageUrls(imageUrls => [...imageUrls, reader.result])
          setLoadingUploader(false)
        }
        reader.readAsDataURL(file)

        formData.append('photos', file)
        fileList.push(file)
      }
      setValue('logo', fileList)

      uploadApi(formData)
    }
  }

  const onRemoveImage = e => {
    const images = imageUrls.filter(image => {
      return image !== e.currentTarget.dataset.id
    })
    setImageUrls(images)
    setValue('logo', images.length !== 0 ? images : null)
  }

  const getMapValue = e => {
    setValue('location', e?.address?.formattedAddress)
    setValue('address', e?.address)
  }

  return (
    <Modal
      title={title}
      visible={isShown}
      onClose={onCancel}
      okText={processType === 'create' ? 'Create Company' : 'Save'}
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base font-body leading-7">
        <div className="flex flex-col items-center md:flex-row">
          <div>
            <div className="font-black mb-2">Complex Logo</div>
            <div className="text-md mb-2">
              This is the image that appears on your complex profile. We
              recommend using a logo with a transparent background.
            </div>
          </div>
          <UploaderImage
            name="image"
            images={imageUrls}
            maxImages={1}
            loading={loadingUploader}
            onUploadImage={onUploadImage}
            onRemoveImage={onRemoveImage}
            circle
          />
        </div>
        <div className="text-danger-500 text-md font-bold">
          {errors?.logo?.message ?? null}
        </div>

        <div className="font-black mb-2 mt-10">About the Complex</div>
        <div className="font-semibold mb-2">Name of Complex</div>
        <Controller
          name="name"
          control={control}
          render={({ name, value, onChange }) => (
            <FormInput
              id={name}
              name={name}
              placeholder="Enter name of complex"
              value={value}
              error={errors?.name?.message ?? null}
              onChange={onChange}
            />
          )}
        />

        <div className="font-semibold mb-2">Location</div>
        <Controller
          name="location"
          control={control}
          render={({ name, value, onChange }) => (
            <FormAddress
              id={name}
              name={name}
              placeholder="Enter complex address"
              value={value}
              onChange={onChange}
              error={errors?.location?.message ?? null}
              getValue={getMapValue}
            />
          )}
        />
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
