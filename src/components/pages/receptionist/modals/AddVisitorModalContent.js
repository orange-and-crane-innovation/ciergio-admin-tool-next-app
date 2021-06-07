import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import P from 'prop-types'
import { Controller } from 'react-hook-form'
import axios from 'axios'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import FormCheckBox from '@app/components/forms/form-checkbox'
import FormTextArea from '@app/components/forms/form-textarea'
import { DateInput, TimeInput } from '@app/components/datetime'
import UploaderImage from '@app/components/uploader/image'

import showToast from '@app/utils/toast'
import { ACCOUNT_TYPES } from '@app/constants'

import { GET_UNITS } from '../query'

function AddVisitorModalContent({ form, buildingId, getImage, type, reset }) {
  const router = useRouter()
  const profile = JSON.parse(window.localStorage.getItem('profile'))
  const profileData = profile?.accounts?.data[0]
  const accountType = profile?.accounts?.data[0]?.accountType
  const companyID = router?.query?.companyId ?? profileData?.company?._id
  const [loading, setLoading] = useState(false)
  const [maxImages] = useState(3)
  const [imageUrls, setImageUrls] = useState([])
  const [imageUploadedData, setImageUploadedData] = useState([])
  const [imageUploadError, setImageUploadError] = useState()
  const [onSchedule, setOnSchedule] = useState(false)
  const { control, errors } = form
  const [units, setUnits] = useState([])
  const [unitHostName, setUnitHostName] = useState([])
  const [host, setHost] = useState([])

  const {
    data,
    error,
    loading: loadingUnits
  } = useQuery(GET_UNITS, {
    variables: {
      where: {
        buildingId
      }
    }
  })

  useEffect(() => {
    resetForm()
  }, [reset])

  useEffect(() => {
    if (buildingId && !error && !loadingUnits && data) {
      const hostName = []
      const unitList = data?.getUnits?.data.map(unit => {
        if (
          unit?.unitOwner &&
          unit?.unitOwner?.user?.firstName &&
          unit?.unitOwner?.user?.lastName
        ) {
          hostName.push({
            value: unit?.unitOwner?._id || unit?._id,
            label: `${unit?.unitOwner?.user?.firstName} ${unit?.unitOwner?.user?.lastName}`
          })
        }
        return {
          value: unit?.unitOwner?._id || unit?._id,
          label: unit.name
        }
      })
      setUnitHostName(hostName)
      setUnits(unitList)
    }
  }, [data, error, loadingUnits])

  useEffect(() => {
    if (imageUploadedData?.length > 1) {
      getImage(imageUploadedData)
    } else {
      getImage(null)
    }
  }, [imageUploadedData])

  const resetForm = () => {
    setOnSchedule(false)
    setImageUploadError(null)
    setImageUrls([])
    setImageUploadedData([])
  }

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
          response.data.map(item => {
            setImageUrls(prevArr => [...prevArr, item.location])
            return setImageUploadedData(prevArr => [
              ...prevArr,
              {
                url: item.location,
                type: item.mimetype
              }
            ])
          })
          setImageUploadError(null)
        }
      })
      .catch(function (error) {
        const errMsg = 'Failed to upload image. Please try again.'
        console.log(error)
        showToast('danger', errMsg)
        setImageUploadError(errMsg)
      })
      .then(() => {
        setLoading(false)
      })
  }

  const onUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      if (files.length + imageUrls?.length > maxImages) {
        showToast('info', `Maximum of ${maxImages} files only`)
      } else {
        setLoading(true)
        setImageUploadError(null)

        if (errors?.images?.message) {
          errors.images.message = null
        }

        for (const file of files) {
          const reader = new FileReader()
          reader.readAsDataURL(file)

          formData.append('files', file)
          fileList.push(file)
        }

        uploadApi(formData)
      }
    }
  }

  const onRemoveImage = e => {
    const images = imageUrls.filter(image => {
      return image !== e.currentTarget.dataset.id
    })
    const uploadedImages = imageUploadedData.filter(image => {
      return image.url !== e.currentTarget.dataset.id
    })
    setImageUrls(images)
    setImageUploadedData(uploadedImages)
  }

  const onRepeatChange = e => setOnSchedule(e.target.checked)

  const setHostName = e => {
    const foundHostName = unitHostName.find(val => val.value === e.value)
    setHost(foundHostName ? [foundHostName] : [])
  }

  return (
    <>
      <div className="w-full text-base leading-7">
        <form>
          <div className="w-full flex flex-col justify-between">
            <h1 className="font-heading font-black text-lg mb-4">
              Event Details
            </h1>
            <div className="w-full flex justify-between align-center">
              <div className="w-1/3 mr-1">
                <h1 className="font-semibold">Unit No.</h1>
                <Controller
                  name="unit_number"
                  control={control}
                  render={({ name, onChange, value }) => {
                    return (
                      <FormSelect
                        name={name}
                        placeholder="Unit No."
                        options={units}
                        value={
                          units
                            ? units.filter(item => item.value === value)
                            : null
                        }
                        onChange={e => {
                          onChange(e.value)
                          setHostName(e)
                        }}
                        error={errors?.unit_number?.message}
                      />
                    )
                  }}
                />
              </div>

              <div className="w-2/3 ml-1">
                <h1 className="font-semibold">Host</h1>
                <Controller
                  name="host"
                  control={control}
                  render={({ name, onChange, value }) => {
                    return (
                      <FormSelect
                        name={name}
                        placeholder="Resident's name"
                        options={host}
                        value={
                          host
                            ? host.filter(item => item.value === value)
                            : null
                        }
                        onChange={e => {
                          onChange(e.value)
                          setHostName(e)
                        }}
                        error={errors?.host?.message}
                      />
                    )
                  }}
                />
              </div>
            </div>

            {(type === 'Deliveries' || type === 'Visitors') && (
              <div className="w-full mb-5">
                <FormCheckBox
                  label="Scheduled Visit"
                  name="4"
                  value={onSchedule}
                  isChecked={onSchedule}
                  onChange={onRepeatChange}
                />
              </div>
            )}

            {onSchedule && (
              <div className="w-full flex justify-between align-center">
                <Controller
                  name="date_of_visit"
                  control={control}
                  render={({ name, onChange, value }) => (
                    <DateInput
                      label="Date of Visit"
                      name={name}
                      date={value}
                      onDateChange={onChange}
                      dateFormat="MMMM DD, YYYY"
                      value={value}
                      constraints={true}
                    />
                  )}
                />

                <Controller
                  name="time_of_visit"
                  control={control}
                  render={({ name, onChange, value }) => (
                    <TimeInput
                      label="Time of Visit"
                      time={value}
                      name={name}
                      onTimeChange={onChange}
                      value={value}
                      placeholder="Enter Time"
                    />
                  )}
                />
              </div>
            )}

            <h1 className="font-heading font-black text-lg my-4">
              Visitor Details
            </h1>
            <div className="w-full flex justify-between align-center">
              <div className="w-1/2 mr-1">
                <h1 className="font-semibold">First Name</h1>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ name, value, onChange }) => (
                    <FormInput
                      type="text"
                      placeholder="Enter first name"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={errors?.first_name?.message}
                    />
                  )}
                />
              </div>

              <div className="w-1/2 ml-1">
                <h1 className="font-semibold">Last Name</h1>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ name, value, onChange }) => (
                    <FormInput
                      type="text"
                      placeholder="Enter last name"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={errors?.last_name?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="w-full mt-4">
              <h1 className="font-semibold">Company (optional)</h1>
              <Controller
                name="company"
                control={control}
                render={({ name, onChange, value }) => (
                  <FormInput
                    type="text"
                    placeholder="Enter Company"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>

            <div className="w-full mt-4">
              <h1 className="font-semibold">Note (optional)</h1>
              <Controller
                name="note"
                control={control}
                render={({ name, onChange, value }) => (
                  <FormTextArea
                    wrapperClassName="h-32"
                    name={name}
                    value={value}
                    maxLength={120}
                    placeholder="Enter additional notes here"
                    onChange={onChange}
                    toolbarHidden
                    withCounter
                    stripHtmls
                  />
                )}
              />
            </div>

            <div className="w-full">
              <h1 className="font-semibold mb-2">Attach Image (Optional)</h1>
              <UploaderImage
                name="image"
                multiple
                maxImages={maxImages}
                images={imageUrls}
                loading={loading}
                onUploadImage={onUploadImage}
                onRemoveImage={onRemoveImage}
                error={errors?.images?.message ?? imageUploadError ?? null}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

AddVisitorModalContent.propTypes = {
  form: P.object,
  buildingId: P.string.isRequired,
  getImage: P.func.isRequired,
  type: P.string.isRequired,
  reset: P.bool
}
export default AddVisitorModalContent
