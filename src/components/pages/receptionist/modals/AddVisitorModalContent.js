import { useState, useEffect } from 'react'
import P from 'prop-types'
import { Controller } from 'react-hook-form'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import FormCheckBox from '@app/components/forms/form-checkbox'
import FormTextArea from '@app/components/forms/form-textarea'
import { DateInput, TimeInput } from '@app/components/datetime'
import UploaderImage from '@app/components/uploader/image'
import { GET_UNITS } from '../query'
import { useQuery } from '@apollo/client'

function AddVisitorModalContent({ form, buildingId }) {
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
  const [onSchedule, setOnSchedule] = useState(false)
  const { control } = form
  const [units, setUnits] = useState([])
  const [unitHostName, setUnitHostName] = useState([])
  const [host, setHost] = useState('')

  const { data, error, loading: loadingUnits } = useQuery(GET_UNITS, {
    variables: {
      where: {
        buildingId
      }
    }
  })

  useEffect(() => {
    if (!error && !loadingUnits && data) {
      console.log(data)
      const hostName = []
      const unitList = data?.getUnits?.data.map(unit => {
        hostName.push({
          id: unit?._id,
          name: unit.name,
          hostname: `${unit?.unitOwner?.user?.firstName} ${unit?.unitOwner?.user?.lastName}`
        })
        return {
          value: unit?._id,
          label: unit.name
        }
      })
      setUnitHostName(hostName)
      setUnits(unitList)
    }
  }, [data, error, loadingUnits])

  const onUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    setLoading(true)
    for (const file of files) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setImageUrls(imageUrls => [...imageUrls, reader.result])
        setLoading(false)
      }
      reader.readAsDataURL(file)

      formData.append('photos', file)
      fileList.push(file)
    }
  }

  const onRemoveImage = e => {
    const images = imageUrls.filter(image => {
      return image !== e.currentTarget.dataset.id
    })
  }

  const onRepeatChange = e => setOnSchedule(e.target.checked)

  const setHostName = e => {
    const foundHostName = unitHostName.find(val => val.name === e.label)
    setHost(foundHostName.hostname)
  }

  return (
    <>
      {' '}
      <div className="w-full">
        <form>
          <div className="w-full flex flex-col justify-between">
            <div className="w-full flex justify-between align-center">
              <div className="w-4/12 mr-4">
                <Controller
                  name="unit_number"
                  control={control}
                  render={({ name, onChange, value }) => (
                    <FormSelect
                      label="Unit"
                      name={name}
                      onChange={e => {
                        onChange(e)
                        setHostName(e)
                      }}
                      value={value}
                      options={units}
                    />
                  )}
                />
              </div>
              <Controller
                name="host"
                control={control}
                render={({ name, onChange, value }) => (
                  <FormSelect
                    label="Host"
                    readOnly={true}
                    name={name}
                    placeholder={host}
                    onChange={onChange}
                    value={value}
                    disabled
                  />
                )}
              />
            </div>
            <div className="w-full mb-5">
              <FormCheckBox
                label="Scheduled Visit"
                name="schedule"
                value={onSchedule}
                isChecked={onSchedule}
                onChange={onRepeatChange}
              />
            </div>
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
                    />
                  )}
                />
              </div>
            )}
            <div className="w-full flex justify-between align-center">
              <Controller
                name="first_name"
                control={control}
                render={({ name, value, onChange }) => (
                  <FormInput
                    placeholder="Enter First Name"
                    type="email"
                    label="Fist Name"
                    onChange={onChange}
                    name={name}
                    value={value}
                    inputClassName="w-full rounded border-gray-300"
                  />
                )}
              />

              <Controller
                name="last_name"
                control={control}
                render={({ name, value, onChange }) => (
                  <FormInput
                    placeholder="Enter Last Name"
                    type="email"
                    label="Last Name"
                    onChange={onChange}
                    name={name}
                    value={value}
                    inputClassName="w-full rounded border-gray-300"
                  />
                )}
              />
            </div>

            <div className="w-full">
              <Controller
                name="company"
                control={control}
                render={({ name, onChange, value }) => (
                  <FormInput
                    placeholder="Enter Company"
                    type="email"
                    label="Company (optional)"
                    onChange={onChange}
                    name={name}
                    value={value}
                    inputClassName="w-full rounded border-gray-300"
                  />
                )}
              />
            </div>
            <div className="w-full h-1/4">
              <p className="text-neutral-dark font-body font-bold text-sm">
                Note (Optional)
              </p>
              <Controller
                name="notes"
                control={control}
                render={({ name, onChange, value }) => (
                  <FormTextArea
                    maxLength={120}
                    placeholder="Enter additional notes here"
                    toolbarHidden={true}
                    onChange={onChange}
                    value={value}
                    withCounter={true}
                  />
                )}
              />
            </div>

            <div className="w-full">
              <p className="text-neutral-dark font-body font-bold text-sm">
                Attach Image (Optional)
              </p>
              <Controller
                name="image"
                control={control}
                render={({ name, onChange, value }) => (
                  <UploaderImage
                    name="image"
                    maxImages={1}
                    images={imageUrls}
                    loading={loading}
                    onUploadImage={onUploadImage}
                    onRemoveImage={onRemoveImage}
                  />
                )}
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
  buildingId: P.string.isRequired
}
export default AddVisitorModalContent
