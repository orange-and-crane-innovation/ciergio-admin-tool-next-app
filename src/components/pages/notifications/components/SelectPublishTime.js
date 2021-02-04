import P from 'prop-types'
import { DateInput, TimeInput } from '@app/components/datetime'

function SelectPublishTime({ publishType, date, onDateChange }) {
  if (publishType === 'now') return null

  return (
    <div className="p-4">
      <div className="mb-4">
        <p className="font-bold">{`Don't share with`}</p>
        <p>You can create the post now then publish it at a later time.</p>
      </div>
      <div className="flex items-center justify-between">
        <DateInput
          date={date}
          onDateChange={onDateChange}
          dateFormat="MMMM DD, YYYY"
        />
        <TimeInput
          timeFormat="h:mm A"
          time={date}
          onTimeChange={onDateChange}
        />
      </div>
      <span className="text-neutral-900">
        Publish Date and Time must be 5 minutes advance on the current date.
      </span>
    </div>
  )
}

SelectPublishTime.propTypes = {
  publishType: P.string.isRequired,
  onDateChange: P.func,
  date: P.instanceOf(Date)
}

export default SelectPublishTime
