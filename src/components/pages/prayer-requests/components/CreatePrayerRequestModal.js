import P from 'prop-types'
import { Controller } from 'react-hook-form'

import Modal from '@app/components/modal'
import FormInput from '@app/components/forms/form-input'
import FormTextArea from '@app/components/forms/form-textarea'
import FormSelect from '@app/components/select'
import FormDate from '@app/components/forms/form-datepicker'

import styles from './CreatePrayerRequest.module.css'

const CreatePrayerRequestModal = ({
  visible,
  onCancel,
  categoryOptions,
  form,
  onSubmit,
  loading
}) => {
  const { control, errors } = form

  return (
    <Modal
      title="Create Prayer Request"
      visible={visible}
      okText="Create Request"
      onCancel={onCancel}
      onClose={onCancel}
      onOk={onSubmit}
      okButtonProps={{
        loading
      }}
    >
      <div className={styles.createPrayerContainer}>
        <form>
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
        </form>
      </div>
    </Modal>
  )
}

CreatePrayerRequestModal.propTypes = {
  visible: P.bool,
  onCancel: P.func,
  categoryOptions: P.array,
  onSubmit: P.func,
  form: P.object,
  loading: P.bool
}

export default CreatePrayerRequestModal
