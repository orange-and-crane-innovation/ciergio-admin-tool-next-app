import P from 'prop-types'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import Modal from '@app/components/modal'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import FormSelect from '@app/components/select'
import FormDate from '@app/components/forms/form-datepicker'

import styles from './CreatePrayerRequest.module.css'
// import Button from '@app/components/button'

const validationSchema = yup.object().shape({
  prayerFor: yup.string().required(),
  prayerFrom: yup.string().required(),
  category: yup.string().email(),
  date: yup.date().default(function () {
    return new Date()
  }),
  message: yup.string()
})

function CreatePrayerRequestModal({ visible, onCancel, categoryOptions }) {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      prayerFor: '',
      prayerFrom: '',
      category: '',
      date: '',
      message: ''
    }
  })

  const onSubmitForm = values => console.log({ values })

  return (
    <Modal
      title="Create Prayer Request"
      visible={visible}
      footer={null}
      // okText="Create Request"
      // onCancel={onCancel}
      // onClose={onCancel}
    >
      <div className={styles.createPrayerContainer}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Controller
            name="prayerFor"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                label="Prayer For"
                labelClassName="text-base font-bold"
                placeholder="Enter name"
                onChange={onChange}
                name={name}
                value={value}
                error={errors?.prayerFor?.message ?? null}
              />
            )}
          />
          <Controller
            name="prayerFrom"
            control={control}
            render={({ name, value, onChange }) => (
              <FormInput
                label="Prayer From"
                labelClassName="text-base font-bold"
                placeholder="Enter name"
                onChange={onChange}
                name={name}
                value={value}
                error={errors?.prayerFrom?.message ?? null}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ name, value, onChange }) => (
              <>
                <label
                  htmlFor={name}
                  className="block font-bold text-neutral-dark text-sm mb-4"
                >
                  Category
                </label>
                <FormSelect
                  placeholder="Choose category"
                  name={name}
                  options={categoryOptions}
                  onChange={onChange}
                  value={value}
                  error={errors?.category?.message}
                  containerClasses="mb-4"
                />
              </>
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ name, value, onChange }) => (
              <div className={styles.dateInput}>
                <FormDate
                  label="Date (optional)"
                  placeholder="Date"
                  onChange={onChange}
                  error={errors?.date?.message}
                  date={value || new Date()}
                  datepickerprops={{
                    name,
                    isClearable: true
                  }}
                />
              </div>
            )}
          />
          <Controller
            name="message"
            control={control}
            render={({ name, value, onChange }) => (
              <>
                <label
                  htmlFor={name}
                  className="block font-bold text-neutral-dark text-sm mb-4"
                >
                  Message (optional)
                </label>
                <FormTextArea
                  label="Message (optional)"
                  placeholder="Give more details about the issue"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={errors?.message?.message}
                  options={[]}
                  toolbarHidden
                  maxLength={500}
                  withCounter
                  editorClassName="h-32"
                />
              </>
            )}
          />
          <div>
            <button>Cancel</button>
            <button type="submit">Create Request</button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

CreatePrayerRequestModal.propTypes = {
  visible: P.bool,
  onCancel: P.func,
  categoryOptions: P.array
}

export default CreatePrayerRequestModal
