import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import UploaderImage from '@app/components/uploader/image'
import Modal from '@app/components/modal'
import Datetime from 'react-datetime'
import dayjs from 'dayjs'

import 'react-datetime/css/react-datetime.css'

import showToast from '@app/utils/toast'
import { ACCOUNT_TYPES } from '@app/constants'

const validationSchema = yup.object().shape({
  logo: yup.array().label('Image').nullable(),
  firstName: yup.string().label('First Name').nullable().trim().required(),
  lastName: yup.string().label('Last Name').nullable().trim().required(),
  birthDate: yup.string().label('Birth Date').nullable(),
  gender: yup.string().label('Gender').nullable()
})

const Component = ({ data, loading, isShown, onSave, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState(
    data?.birthDate ? dayjs(data?.birthDate).format('MMMM DD, YYYY') : null
  )
  const [loadingUploader, setLoadingUploader] = useState(false)
  const [fileUploadError, setFileUploadError] = useState()
  const [imageUrls, setImageUrls] = useState([])
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id

  const { handleSubmit, control, errors, register, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: data?._id,
      logo: data?.avatar ? [data?.avatar] : [],
      firstName: data?.firstName,
      lastName: data?.lastName,
      birthDate: selectedDate,
      gender: data?.gender
    }
  })

  useEffect(() => {
    register({ name: 'id' })
    register({ name: 'logo' })
    if (data) {
      setValue('id', data?._id)
      setValue('logo', data?.avatar ? [data?.avatar] : [])
      setValue('firstName', data?.firstName)
      setValue('lastName', data?.lastName)
      setSelectedDate(
        data?.birthDate ? dayjs(data.birthDate).format('MMMM DD, YYYY') : null
      )
      setImageUrls(data?.avatar ? [data?.avatar] : [])
    }
  }, [isShown, data])

  const uploadApi = async payload => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'company-id':
          accountType === ACCOUNT_TYPES.SUP.value ? 'oci' : companyID
      }
    }

    await axios
      .post(process.env.NEXT_PUBLIC_UPLOAD_API, payload, config)
      .then(function (response) {
        if (response.data) {
          const imageData = response.data.map(item => {
            return item.location
          })
          setValue('logo', imageData)
          setFileUploadError(null)
        }
      })
      .catch(function (error) {
        const errMsg = 'Failed to upload image. Please try again.'
        console.log(error)
        showToast('danger', errMsg)
        setFileUploadError(errMsg)
        setValue('logo', null)
      })
      .then(() => {
        setLoadingUploader(false)
      })
  }

  const onUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      setLoadingUploader(true)
      setFileUploadError(null)

      if (errors?.logo?.message) {
        errors.logo.message = null
      }

      for (const file of files) {
        const reader = new FileReader()

        reader.onloadend = () => {
          setImageUrls(imageUrls => [...imageUrls, reader.result])
        }
        reader.readAsDataURL(file)

        formData.append('files', file)
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

  const handleDateChange = e => {
    setSelectedDate(e)
  }

  const validateDate = currentDate => {
    if (currentDate) {
      return currentDate.isSameOrBefore(dayjs(new Date()))
    }
    return true
  }

  const genderOptions = [
    {
      label: 'Male',
      value: 'male'
    },
    {
      label: 'Female',
      value: 'female'
    },
    {
      label: 'Prefer not to say',
      value: 'not-to-say'
    }
  ]

  return (
    <Modal
      title="Edit Profile"
      visible={isShown}
      okButtonProps={{
        disabled: loading
      }}
      onClose={onCancel}
      okText="Save"
      onOk={handleSubmit(onSave)}
      onCancel={onCancel}
    >
      <div className="p-2 text-base font-body leading-7">
        <div className="mb-4 flex flex-col items-center md:flex-row">
          <div>
            <div className="font-semibold mb-2">Profile Photo</div>
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
        </div>
        <div className="text-danger-500 text-md font-bold">
          {errors?.logo?.message ?? fileUploadError ?? null}
        </div>

        <div className="font-semibold mb-2">First Name</div>
        <Controller
          name="firstName"
          control={control}
          render={({ name, value, onChange }) => (
            <FormInput
              id={name}
              name={name}
              placeholder="Enter your first name"
              value={value}
              error={errors?.firstName?.message ?? null}
              onChange={onChange}
            />
          )}
        />

        <div className="font-semibold mb-2">Last Name</div>
        <Controller
          name="lastName"
          control={control}
          render={({ name, value, onChange }) => (
            <FormInput
              id={name}
              name={name}
              placeholder="Enter your last name"
              value={value}
              error={errors?.lastName?.message ?? null}
              onChange={onChange}
            />
          )}
        />

        <Controller
          name="birthDate"
          control={control}
          render={({ name, value, onChange }) => (
            <Datetime
              renderInput={(props, openCalendar) => (
                <>
                  <div className="font-semibold">Birth Date</div>
                  <div className="relative">
                    <FormInput
                      {...props}
                      inputProps={{
                        style: { backgroundColor: 'white' }
                      }}
                      id={name}
                      name={name}
                      defaultValue={dayjs(selectedDate).format('MMM DD, YYYY')}
                      error={errors?.[name]?.message ?? null}
                      readOnly
                    />
                    <i
                      className="ciergio-calendar absolute top-3 right-4 cursor-pointer"
                      onClick={openCalendar}
                    />
                  </div>
                </>
              )}
              dateFormat="MMMM DD, YYYY"
              timeFormat={false}
              value={selectedDate}
              isValidDate={validateDate}
              closeOnSelect
              onChange={e => {
                onChange(e)
                handleDateChange(e)
              }}
            />
          )}
        />

        <div className="font-semibold mb-2">Gender</div>
        <Controller
          name="gender"
          control={control}
          render={({ value, onChange, name }) => (
            <FormSelect
              name={name}
              value={
                genderOptions
                  ? genderOptions.filter(item => item.value === value)
                  : null
              }
              onChange={e => onChange(e.value)}
              options={genderOptions}
              error={errors?.gender?.message || undefined}
              placeholder="Select a gender"
            />
          )}
        />
      </div>
    </Modal>
  )
}

Component.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  isShown: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
}

export default Component
