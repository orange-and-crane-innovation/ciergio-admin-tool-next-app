import P from 'prop-types'

import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'
import { Controller } from 'react-hook-form'

function EditStaffContent({ form, open, onCancel, onOk, loading }) {
  const { control, errors } = form

  return (
    <Modal
      title="Edit Staff"
      okText="Edit Staff"
      visible={open}
      onClose={onCancel}
      onCancel={onCancel}
      okButtonProps={{
        loading
      }}
      onOk={onOk}
      width={450}
    >
      <div className="w-full p-4">
        <form>
          <div className="mb-4">
            <p className="font-bold text-base text-gray-500 mb-2">First Name</p>
            <Controller
              name="staffFirstName"
              control={control}
              render={({ name, onChange, value }) => (
                <FormInput
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Enter staff first name"
                  error={errors?.staffFirstName?.message}
                />
              )}
            />
          </div>
          <div>
            <p className="font-bold text-base text-gray-500 mb-2">Last Name</p>
            <Controller
              name="staffLastName"
              control={control}
              render={({ name, onChange, value }) => (
                <FormInput
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Enter staff last name"
                  error={errors?.staffLastName?.message}
                />
              )}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

EditStaffContent.propTypes = {
  form: P.object,
  open: P.bool,
  loading: P.bool,
  onOk: P.func,
  onCancel: P.func
}

export default EditStaffContent
