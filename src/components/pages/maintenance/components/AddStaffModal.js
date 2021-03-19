import P from 'prop-types'
import Modal from '@app/components/modal'
import FormSelect from '@app/components/forms/form-select'
import { Controller } from 'react-hook-form'

function AddStaffModal({ open, onOk, onCancel, loading, form, options }) {
  const { errors, control } = form

  return (
    <Modal
      title="Add staff to this ticket"
      visible={open}
      onOk={onOk}
      onCancel={onCancel}
      onClose={onCancel}
      okText="Confirm"
      okButtonProps={{
        loading
      }}
    >
      <Controller
        control={control}
        name="staff"
        render={({ name, value, onChange }) => (
          <FormSelect
            label="Staff Name"
            name={name}
            placeholder="Choose staff name"
            options={options}
            value={value}
            onChange={onChange}
            error={errors?.staff?.message}
          />
        )}
      />
    </Modal>
  )
}

AddStaffModal.propTypes = {
  open: P.bool.isRequired,
  onOk: P.func.isRequired,
  onCancel: P.func.isRequired,
  loading: P.bool,
  form: P.object.isRequired,
  options: P.array.isRequired
}

export default AddStaffModal
