import P from 'prop-types'
import { Controller } from 'react-hook-form'
import FormInput from '@app/components/forms/form-input'
import Modal from '@app/components/modal'

function ContactModal({ open, form, onOk, onCancel, loading, selected }) {
  const { control, errors } = form

  return (
    <Modal
      title={`${selected ? 'Edit' : 'Add'} a Contact`}
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
          <span className="text-base font-bold">Title</span>
          <Controller
            name="title"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                inputClassName="mt-2"
                placeholder="Enter title of contact"
                onChange={onChange}
                name={name}
                value={value}
                error={errors?.title?.message}
                defaultValue={selected?.title}
              />
            )}
          />
          <span className="text-base font-bold">Contact Name</span>
          <Controller
            name="name"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                inputClassName="mt-2"
                placeholder="Enter name of contact"
                onChange={onChange}
                name={name}
                value={value}
                error={errors?.name?.message}
                defautValue={selected?.name}
              />
            )}
          />
          <span className="text-base font-bold">Contact Email</span>
          <Controller
            name="email"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                inputClassName="w-full rounded border-gray-300 mt-2"
                placeholder="Enter email of contact"
                type="email"
                name={name}
                onChange={onChange}
                value={value}
                error={errors?.email?.message}
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
