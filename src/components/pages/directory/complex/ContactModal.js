import { useEffect, useState } from 'react'
import P from 'prop-types'
import { Controller } from 'react-hook-form'
import Modal from '@app/components/modal'
import UploaderImage from '@app/components/uploader/image'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import ReactSelect from 'react-select'
import FormAddress from '@app/components/forms/form-address'
import PhoneNumberInput from '@app/components/globals/PhoneNumberInput'

function ContactModal({
  form,
  open,
  onOk,
  onCancel,
  loading,
  categoryOptions,
  onGetMapValue,
  imageURLs,
  onUploadImage,
  onRemoveImage,
  uploading,
  selected
}) {
  const { control, errors, setValue } = form
  const [logo, setLogo] = useState([])
  const [canReplace, setCanReplace] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (!isDirty && selected) {
      setValue('category', {
        label: selected?.category?.name,
        value: selected?.category?._id
      })
    }
    if (selected) {
      setValue('address', selected?.address)
    }
    if (!canReplace && selected) {
      setCanReplace(true)
      if (selected?.logo) {
        setLogo([selected?.logo])
      }
    }
    if (canReplace || !selected) {
      setLogo(imageURLs)
    }
  }, [selected, imageURLs?.length, categoryOptions])

  const handleClose = () => {
    setCanReplace(false)
    setIsDirty(false)
    setLogo([])
    onCancel()
  }

  const handleRemoveImage = e => {
    if (logo?.length > 0) {
      setLogo([])
    }
    onRemoveImage(e)
  }

  return (
    <Modal
      title={`${selected ? 'Edit' : 'Add'} a Contact`}
      okText="Okay"
      visible={open}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={onOk}
      cancelText="Close"
      okButtonProps={{
        loading,
        disabled: uploading || loading
      }}
    >
      <div className="w-full p-4">
        <div className="flex justify-between mb-4 items-start">
          <div className="mr-4">
            <h1 className="text-base font-bold mb-4">Contact Logo</h1>
            <p>Upload a photo that’s easily recognizable to your members.</p>
          </div>

          <div>
            <UploaderImage
              name="images"
              images={logo}
              loading={uploading}
              onUploadImage={onUploadImage}
              onRemoveImage={handleRemoveImage}
              maxImages={1}
              circle
            />
          </div>
        </div>
        <form>
          <h1 className="text-base font-bold mb-4">Contact Details</h1>
          <span className="font-bold text-neutral-500">
            Choose a contact category
          </span>
          <Controller
            name="category"
            control={control}
            render={({ name, value, onChange }) => (
              <ReactSelect
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                options={categoryOptions}
                onChange={option => {
                  setIsDirty(true)
                  onChange(option)
                }}
                value={
                  selected && !isDirty
                    ? {
                        label: selected?.category?.name,
                        value: selected?.category?._id
                      }
                    : value
                }
                placeholder="Choose a contact category"
                error={errors?.category?.value?.message}
              />
            )}
          />
          <div>
            <span className="font-bold text-neutral-500">Contact Name</span>
            <Controller
              name="name"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  inputClassName="mt-2"
                  placeholder="Enter contact name"
                  onChange={onChange}
                  name={name}
                  value={value}
                  error={errors?.name?.message}
                  defaultValue={selected?.name}
                />
              )}
            />
          </div>

          <Controller
            name="contactNumber"
            control={control}
            render={({ name, value, onChange }) => (
              <PhoneNumberInput
                label="Contact Number"
                labelClassName="mb-2 font-bold text-neutral-500 block"
                value={value}
                onPhoneChange={onChange}
                name={name}
                error={errors?.contactNumber?.message}
                defaultValue={selected?.contactNumber}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ name, value, onChange }) => (
              <FormAddress
                label="Contact Address"
                labelClassName="mb-2 font-bold text-neutral-500 block"
                placeholder="(optional) Enter contact address"
                name={name}
                onChange={onChange}
                value={value?.formattedAddress || value || ''}
                error={errors?.address?.message}
                getValue={onGetMapValue}
              />
            )}
          />
        </form>
      </div>
    </Modal>
  )
}

ContactModal.propTypes = {
  form: P.object.isRequired,
  open: P.bool.isRequired,
  onOk: P.func.isRequired,
  onCancel: P.func.isRequired,
  categoryOptions: P.array.isRequired,
  onGetMapValue: P.func.isRequired,
  loading: P.bool,
  uploading: P.bool,
  imageURLs: P.array,
  onRemoveImage: P.func,
  onUploadImage: P.func,
  selected: P.object
}

export default ContactModal
