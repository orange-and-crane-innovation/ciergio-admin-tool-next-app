import { useEffect, useMemo } from 'react'
import P from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import Modal from '@app/components/modal'
import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import UploaderImage from '@app/components/uploader/image'
import SelectCategory from '@app/components/globals/SelectCategory'
import { Controller } from 'react-hook-form'
import { GET_RESIDENTS } from '../queries'
// import { AiOutlineUserAdd } from 'react-icons/ai'

function CreateTicketModal({
  open,
  loading,
  onOk,
  onCancel,
  form,
  unitOptions,
  imageURLs,
  onUploadImage,
  onRemoveImage,
  staffOptions
}) {
  const { errors, control, watch } = form

  const selectedUnit = watch('unitNumber')
  const [fetchResidents, { data, loading: loadingResidents }] = useLazyQuery(
    GET_RESIDENTS
  )

  useEffect(() => {
    if (selectedUnit) {
      fetchResidents()
    }
  }, [selectedUnit])

  const residentsOptions = useMemo(() => {
    if (data?.getAccounts?.data?.length > 0) {
      return data.getAccounts.data.map(res => ({
        label: res.name,
        value: res._id
      }))
    }
  }, [data?.getAccounts])
  return (
    <Modal
      visible={open}
      title="Create Ticket"
      onClose={onCancel}
      okText="Create Ticket"
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={{
        loading
      }}
    >
      <form>
        <div className="w-full mb-4">
          <h2 className="font-bold text-base mb-4 text-neutral-900">
            Requested By
          </h2>
          <div className="flex w-full justify-between items-center">
            <div className="w-4/12">
              <p className="font-medium mb-1">Unit No.</p>
              <Controller
                name="unitNumber"
                control={control}
                render={({ name, value, onChange }) => (
                  <FormSelect
                    name={name}
                    value={value}
                    onChange={onChange}
                    options={unitOptions}
                    placeholder="Unit No."
                    error={errors?.unitNumber?.messsage}
                  />
                )}
              />
            </div>
            <div className="w-8/12 ml-4">
              <p className="font-medium mb-1">Requestor</p>
              <Controller
                name="requestor"
                control={control}
                render={({ name, value, onChange }) => (
                  <FormSelect
                    name={name}
                    value={value}
                    onChange={onChange}
                    options={residentsOptions}
                    placeholder="Resident's Name"
                    loading={loadingResidents}
                    error={errors?.requestor?.messsage}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-4">
          <h2 className="font-bold text-base mb-4 text-neutral-900">
            About the Issue
          </h2>
          <div className="w-8/12 mb-8">
            <p className="font-medium mb-1">Category</p>
            <Controller
              name="category"
              control={control}
              render={({ name, value, onChange }) => (
                <SelectCategory
                  name={name}
                  type="issue"
                  selected={value}
                  placeholder="Category"
                  onChange={cat => onChange(cat?.value)}
                  onClear={() => onChange(null)}
                />
              )}
            />
          </div>
          <div className="w-full mb-8">
            <p className="font-medium mb-1">Title</p>
            <Controller
              name="title"
              control={control}
              render={({ value, onChange, name }) => (
                <FormInput
                  value={value}
                  onChange={onChange}
                  name={name}
                  placeholder="Enter Title"
                />
              )}
            />
          </div>
          <div className="w-full mb-8">
            <p className="font-medium mb-1">Message</p>
            <Controller
              name="content"
              control={control}
              render={({ value, onChange, name }) => (
                <FormTextArea
                  value={value}
                  onChange={onChange}
                  name={name}
                  placeholder="Give more details about the issue"
                  maxLength={200}
                  withCounter
                  options={[]}
                  error={errors?.content?.message ?? null}
                />
              )}
            />
          </div>
          <div className="w-full mb-8">
            <p className="font-medium mb-2">Attach Photo</p>
            <UploaderImage
              name="image"
              maxImages={1}
              images={imageURLs}
              loading={loading}
              error={errors?.images?.message ?? null}
              onUploadImage={onUploadImage}
              onRemoveImage={onRemoveImage}
            />
          </div>
          <div className="w-full">
            {/* TODO: change to new UI later */}
            <p className="font-medium mb-2">Assign Staff</p>
            <div className="w-full flex justify-start items-center">
              {/* <div className="w-12 h-12 border border-blue-500 border-dashed rounded-full mr-4 flex justify-center items-center">
                <AiOutlineUserAdd className="text-blue-500" />
              </div>
              <p className="font-bold text-base text-blue-500">Add Staff</p> */}
              <Controller
                name="staff"
                control={control}
                render={({ name, value, onChange }) => (
                  <FormSelect
                    name={name}
                    value={value}
                    onChange={onChange}
                    options={staffOptions}
                    placeholder="Select Staff"
                    error={errors?.staff?.messsage}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}

CreateTicketModal.propTypes = {
  open: P.bool.isRequired,
  onOk: P.func.isRequired,
  onCancel: P.func.isRequired,
  loading: P.bool,
  form: P.object.isRequired,
  residentOptions: P.array.isRequired,
  unitOptions: P.array.isRequired,
  staffOptions: P.array.isRequired,
  imageURLs: P.array,
  onUploadImage: P.func.isRequired,
  onRemoveImage: P.func.isRequired
}

export default CreateTicketModal
