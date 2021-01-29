import { useEffect, useState } from 'react'
import P from 'prop-types'
import FormInput from '@app/components/forms/form-input'
import DatePicker from '@app/components/forms/form-datepicker/'

export default function UpdateBills({ amount, dueDate }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleChangeDate = date => {
    setSelectedDate(date)
  }

  useEffect(() => {
    setSelectedDate(dueDate)
  }, [dueDate])

  return (
    <>
      <form className="custom-form w-label">
        <div className="w-full">
          <FormInput
            label="Amount"
            placeholder={amount && amount.toFixed(2)}
            type="text"
            onChange={e => console.log('log')}
            name="amount"
            inputClassName="w-full rounded border-gray-300"
          />
          {selectedDate && (
            <DatePicker
              inputClassname="w-screen"
              label="Due Date"
              disabledPreviousDate={new Date()}
              date={selectedDate}
              onChange={handleChangeDate}
            />
          )}
        </div>
      </form>
    </>
  )
}

UpdateBills.propTypes = {
  amount: P.number,
  dueDate: P.date
}
