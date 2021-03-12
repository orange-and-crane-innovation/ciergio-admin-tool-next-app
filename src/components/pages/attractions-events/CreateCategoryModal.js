import FormInput from '@app/components/forms/form-input'
import { FormSelect } from '@app/components/globals'
import Modal from '@app/components/modal'
import P from 'prop-types'
import { Controller } from 'react-hook-form'

function CreateCategoryModal({ open, onCancel, onOk, loading, form, options }) {
  const { control, errors } = form

  return (
    <Modal
      title="Add Category"
      visible={open}
      onCancel={onCancel}
      onClose={onCancel}
      onOk={onOk}
      okText="Save"
      okButtonProps={{
        loading
      }}
    >
      <form>
        <div>
          <Controller
            control={control}
            name="name"
            render={({ name, value, onChange }) => (
              <FormInput
                label="New Category Name"
                name={name}
                value={value}
                onChange={onChange}
                placeholder="Enter new category"
                error={errors?.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="company"
            render={({ name, value, onChange }) => (
              <FormSelect
                label="Company"
                name={name}
                value={value}
                onChange={onChange}
                options={options}
                placeholder="Select a company"
              />
            )}
          />
        </div>
      </form>
    </Modal>
  )
}

CreateCategoryModal.propTypes = {
  open: P.bool,
  onCancel: P.func,
  onOk: P.func,
  loading: P.bool,
  form: P.object,
  options: P.array
}

export default CreateCategoryModal
