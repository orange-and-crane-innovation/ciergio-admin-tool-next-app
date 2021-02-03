import { useEffect, useState } from 'react'
import P from 'prop-types'
import FormInput from '@app/components/forms/form-input'
import DatePicker from '@app/components/forms/form-datepicker/'
import FileUpload from '@app/components/forms/form-fileupload'

export default function UpdateBills({ amount, dueDate, fileUrl }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [text, setText] = useState('')

  const handleChangeDate = date => {
    setSelectedDate(date)
  }

  const handleTextChange = e => {
    const value = e.target.value
    setText(value)
  }

  return (
    <>
      <form className="custom-form w-label">
        <div className="w-full px-2 py-3">
          <div className="form-group">
            <label className="control-label text-gray-700 font-semibold">
              Upload File:
            </label>
            <FileUpload id="file" fileUrl={fileUrl} />
          </div>
          <FormInput
            label="Amount"
            placeholder={`₱ ${amount.toFixed(2)}`}
            type="text"
            onChange={handleTextChange}
            name="amount"
            value={text}
            inputClassName="w-full rounded border-gray-300"
          />
          {selectedDate && (
            <>
              <label className="text-gray-700 font-semibold">Due Date</label>
              <DatePicker
                inputClassname="w-screen"
                disabledPreviousDate={dueDate}
                date={selectedDate}
                onChange={handleChangeDate}
              />
            </>
          )}
        </div>
      </form>
    </>
  )
}

UpdateBills.propTypes = {
  amount: P.number,
  dueDate: P.string,
  fileUrl: P.string
}
