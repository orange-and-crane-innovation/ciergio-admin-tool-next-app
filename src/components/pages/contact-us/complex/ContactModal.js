import P from 'prop-types'
import { Controller } from 'react-hook-form'
import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'

function ContactModal({ open, form, onOk, onCancel, loading, selected }) {
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
      width={450}
    >
      <div className="w-full p-4">
        <form>
          <Controller
            name="title"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                label="Title"
                labelClassName="text-base font-bold"
                placeholder="Enter title of contact"
                onChange={onChange}
                name={name}
                value={value}
                error={errors?.title?.message}
                defaultValue={selected?.title}
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                label="Contact Name"
                labelClassName="text-base font-bold"
                placeholder="Enter name of contact"
                onChange={onChange}
                name={name}
                value={value}
                error={errors?.name?.message}
                defautValue={selected?.name}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                label="Contact Email"
                labelClassName="text-base font-bold"
                placeholder="Enter email of contact"
                type="email"
                name={name}
                onChange={onChange}
                value={value}
                error={errors?.email?.message}
                inputClassName="w-full rounded border-gray-300"
                defaultValue={selected?.email}
              />
            )}
          />
        </form>
      </div>
    </Modal>
  )
}

ContactModal.propTypes = {
  open: P.bool.isRequired,
  onOk: P.func.isRequired,
  onCancel: P.func.isRequired,
  form: P.object.isRequired,
  loading: P.bool,
  selected: P.object
}

export default ContactModal
