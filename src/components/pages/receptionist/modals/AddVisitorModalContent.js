import { useState } from 'react'
import P from 'prop-types'
import { Controller } from 'react-hook-form'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import FormCheckBox from '@app/components/forms/form-checkbox'
import FormTextArea from '@app/components/forms/form-textarea'
import { DateInput, TimeInput } from '@app/components/datetime'
import UploaderImage from '@app/components/uploader/image'

function AddVisitorModalContent({ form }) {
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
  const [onSchedule, setOnSchedule] = useState(false)
  const { control } = form

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
    setImageUrls(images)
  }

  const onRepeatChange = e => setOnSchedule(e.target.checked)

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
                      onChange={onChange}
                      value={value}
                      options={[
                        {
                          label: 'Unit 1',
                          value: 'unit-1'
                        }
                      ]}
                    />
                  )}
                />
              </div>
              <Controller
                name="unit_owner_name"
                control={control}
                render={({ name, onChange, value }) => (
                  <FormSelect
                    label="Host"
                    readOnly={true}
                    name={name}
                    onChange={onChange}
                    value={value}
                    options={[
                      {
                        label: 'Unit 1',
                        value: 'unit-1'
                      }
                    ]}
                  />
                )}
              />
            </div>
            <div className="w-full mb-5">
              <Controller
                name="unit_owner_name"
                control={control}
                render={({ name, onChange, value }) => (
                  <FormCheckBox
                    label="Scheduled Visit"
                    name="schedule"
                    value={onSchedule}
                    isChecked={onSchedule}
                    onChange={onRepeatChange}
                  />
                )}
              />
            </div>
            {onSchedule && (
              <div className="w-full flex justify-between align-center">
                <Controller
                  name="unit_number"
                  control={control}
                  render={({ name, onChange, value }) => (
                    <DateInput
                      label="Date of Visit"
                      date={new Date()}
                      onDateChange={date => console.log(date)}
                      dateFormat="MMMM DD, YYYY"
                    />
                  )}
                />

                <Controller
                  name="unit_owner_name"
                  control={control}
                  render={({ name, onChange, value }) => (
                    <TimeInput
                      label="Time of Visit"
                      time={new Date()}
                      onTimeChange={date => console.log(date)}
                    />
                  )}
                />
              </div>
            )}
            <div className="w-full flex justify-between align-center">
              <Controller
                name="resident_email"
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
                name="resident_email"
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
                name="unit_owner_name"
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
                name="unit_owner_name"
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
                name="unit_owner_name"
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
  form: P.object
}
export default AddVisitorModalContent
