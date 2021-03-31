import P from 'prop-types'
import { Controller } from 'react-hook-form'
import Modal from '@app/components/modal'
import UploaderImage from '@app/components/uploader/image'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import FormAddress from '@app/components/forms/form-address'
import PhoneNumberInput from '@app/components/globals/PhoneNumberInput'

function AddContactModal({
  form,
  open,
  onOk,
  onCancel,
  loading,
  categoryOptions,
  onGetMapValue,
  imageURLs,
  onUploadImage,
  onRemoveImage
}) {
  const { control, errors } = form

  return (
    <Modal
      title="Add a Contact"
      okText="Okay"
      visible={open}
      onClose={onCancel}
      onCancel={onCancel}
      onOk={onOk}
      cancelText="Close"
      okButtonProps={{
        loading
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
              images={imageURLs}
              loading={loading}
              onUploadImage={onUploadImage}
              onRemoveImage={onRemoveImage}
              maxImages={1}
              circle
            />
          </div>
        </div>
        <form>
          <h1 className="text-base font-bold mb-4">Contact Details</h1>
          <Controller
            name="category"
            control={control}
            render={({ name, value, onChange }) => (
              <FormSelect
                label="Choose contact category"
                name={name}
                options={categoryOptions}
                placeholder="Choose a contact category"
                onChange={onChange}
                value={value}
                error={errors?.category?.value?.message}
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                label="Contact Name"
                labelClassName="font-bold text-neutral-500"
                placeholder="Enter contact name"
                onChange={onChange}
                name={name}
                value={value}
                error={errors?.name?.message}
              />
            )}
          />
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
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ name, value, onChange }) =>
              console.log({ value }) || (
                <FormAddress
                  label="Contact Address"
                  labelClassName="mb-2 font-bold text-neutral-500 block"
                  placeholder="(optional) Enter contact address"
                  name={name}
                  onChange={onChange}
                  value={value?.formattedAddress}
                  error={errors?.address?.message}
                  getValue={onGetMapValue}
                />
              )
            }
          />
        </form>
      </div>
    </Modal>
  )
}

AddContactModal.propTypes = {
  form: P.object.isRequired,
  open: P.bool.isRequired,
  onOk: P.func.isRequired,
  onCancel: P.func.isRequired,
  categoryOptions: P.array.isRequired,
  onGetMapValue: P.func.isRequired,
  loading: P.bool,
  imageURLs: P.array,
  onRemoveImage: P.func,
  onUploadImage: P.func
}

export default AddContactModal
