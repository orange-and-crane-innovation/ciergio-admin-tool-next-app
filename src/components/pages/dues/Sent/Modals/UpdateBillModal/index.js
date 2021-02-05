import { useEffect, useState } from 'react'
import P from 'prop-types'
import FormInput from '@app/components/forms/form-input'
import DatePicker from '@app/components/forms/form-datepicker/'
import FileUpload from '@app/components/forms/form-fileupload'
import { Controller } from 'react-hook-form'

export default function UpdateBillModal({ amount, dueDate, fileUrl, form }) {
  const { control } = form

  return (
    <>
      <form className="custom-form w-label">
        <div className="w-full px-2 py-3">
          <div className="form-group">
            <label
              className="control-label text-gray-700 font-semibold"
              htmlFor="fileUrl"
            >
              Upload File:
            </label>
            <Controller
              name="fileUrl"
              control={control}
              render={({ name, onChange, value }) => (
                <FileUpload id="file" name={name} fileUrl={fileUrl} />
              )}
            />
          </div>
          <Controller
            name="amount"
            control={control}
            render={(name, value, onChange) => (
              <FormInput
                label="Amount"
                placeholder={`₱ ${amount.toFixed(2)}`}
                type="text"
                onChange={onChange}
                name={name}
                value={value}
                inputClassName="w-full rounded border-gray-300"
              />
            )}
          />

          <label className="text-gray-700 font-semibold" htmlFor="dueDate">
            Due Date
          </label>
          <Controller
            name="dueDate"
            control={control}
            render={(name, value, onChange) => (
              <DatePicker
                inputClassname="w-screen"
                disabledPreviousDate={dueDate}
                date={value}
                onChange={onChange}
                name={name}
              />
            )}
          />
        </div>
      </form>
    </>
  )
}

UpdateBillModal.propTypes = {
  amount: P.number,
  dueDate: P.string,
  fileUrl: P.string,
  form: P.object
}
