import { useEffect, useState } from 'react'
import P from 'prop-types'
import FormInput from '@app/components/forms/form-input'
import DatePicker from '@app/components/forms/form-datepicker/'
import FileUpload from '@app/components/forms/form-fileupload'
import { Controller } from 'react-hook-form'

export default function UpdateBills({ amount, dueDate, fileUrl, getData }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [text, setText] = useState('')
  const [data, setData] = useState({
    attachment: {
      fileUrl,
      fileType: 'pdf'
    },
    amount,
    dueDate
  })

  const handleChangeDate = dueDate => {
    setSelectedDate(dueDate)
    setData(prevState => ({ ...prevState, dueDate }))
  }

  const handleTextChange = e => {
    const amount = e.target.value
    setText(amount)
    setData(prevState => ({ ...prevState, amount }))
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
  fileUrl: P.string,
  form: P.object
}
