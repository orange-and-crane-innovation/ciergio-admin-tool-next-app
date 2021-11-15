import P from 'prop-types'
import { Controller } from 'react-hook-form'
import Modal from '@app/components/modal'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import { TimeInput, DateInput } from '@app/components/datetime'
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
              <div className="relative">
                <FormInput
                  label="Prayer For"
                  labelClassName={styles.label}
                  placeholder="Enter name"
                  onChange={onChange}
                  name={name}
                  value={value}
                  error={errors?.prayerFor?.message ?? null}
                  maxLength={50}
                />
                <div
                  className={styles.prayerInputCounter}
                >{`${value?.length}/50`}</div>
              </div>
            )}
          />
          <Controller
            name="prayerFrom"
            control={control}
            render={({ name, value, onChange }) => (
              <div className="relative">
                <FormInput
                  label="Prayer From"
                  labelClassName={styles.label}
                  placeholder="Enter name"
                  onChange={onChange}
                  name={name}
                  value={value}
                  error={errors?.prayerFrom?.message ?? null}
                  maxLength={50}
                />
                <div
                  className={styles.prayerInputCounter}
                >{`${value?.length}/50`}</div>
              </div>
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ name, value, onChange }) => (
              <>
                <label
                  htmlFor={name}
                  className={
                    errors?.category
                      ? `${styles.label} text-red-500`
                      : styles.label
                  }
                >
                  Category
                </label>
                <FormSelect
                  placeholder="Choose category"
                  name={name}
                  options={categoryOptions}
                  onChange={onChange}
                  value={value}
                  error={
                    errors?.category?.message
                      ? 'This field is required'
                      : errors?.category?.value.message
                  }
                  containerClasses="mb-4"
                />
              </>
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ name, value, onChange }) => {
              return (
                <div className={styles.dateInput}>
                  <DateInput
                    label="Date and Time (optional)"
                    placeholder="Date"
                    withTime={true}
                    onDateChange={onChange}
                    error={errors?.date?.message}
                    date={value}
                    placeHolder="Date"
                    minDate={new Date()}
                  />
                </div>
              )
            }}
          />
          <Controller
            name="message"
            control={control}
            render={({ name, value, onChange }) => (
              <div className="relative">
                <label htmlFor={name} className={styles.label}>
                  Message (optional)
                </label>
                <textarea
                  maxLength={500}
                  value={value}
                  name={name}
                  onChange={onChange}
                  className="rounded p-2 w-full h-36"
                  placeholder="Give more details about the issue"
                />
                <div
                  className={styles.messageInputCounter}
                >{`${value?.length}/500`}</div>
              </div>
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
