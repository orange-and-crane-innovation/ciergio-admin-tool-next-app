import P from 'prop-types'
import RadioBox from '@app/components/forms/form-radio'
import { DateInput } from '@app/components/datetime'
import FormInput from '@app/components/forms/form-input'

function RepeatOptions({
  repeat,
  onSelectRepeat,
  repeatEndOption,
  instance,
  onChangeInstance,
  repeatDate,
  onRepeatDateChange
}) {
  if (!repeat) {
    return null
  }

  return (
    <div className="flex flex-col p-4 justify-center">
      <h4 className="text-base font-bold text-gray-500">End</h4>
      <div className="w-1/4 mb-2">
        <RadioBox
          primary
          id="never"
          name="never"
          label="Never"
          value="never"
          onChange={onSelectRepeat}
          isChecked={repeatEndOption === 'never'}
        />
      </div>
      <div className="flex items-center mb-2">
        <div className="w-1/4">
          <RadioBox
            primary
            id="on"
            name="on"
            label="On"
            value="on"
            onChange={onSelectRepeat}
            isChecked={repeatEndOption === 'on'}
          />
        </div>

        <div className="w-1/2">
          <DateInput
            disabled={repeatEndOption !== 'on'}
            date={repeatDate}
            onDateChange={onRepeatDateChange}
            dateFormat="MMMM DD, YYYY"
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-1/4">
          <RadioBox
            primary
            id="after"
            name="after"
            label="After"
            value="after"
            onChange={onSelectRepeat}
            isChecked={repeatEndOption === 'after'}
          />
        </div>
        <div className="flex items-center w-1/2">
          <FormInput
            value={instance}
            inputProps={{
              disabled: repeatEndOption !== 'after'
            }}
            onChange={onChangeInstance}
            name="instances"
          />
          <p className="ml-4">instance</p>
        </div>
      </div>
    </div>
  )
}

RepeatOptions.propTypes = {
  repeat: P.bool,
  repeatEndOption: P.string,
  onSelectRepeat: P.func,
  onChangeInstance: P.func,
  instance: P.string,
  repeatDate: P.instanceOf(Date),
  onRepeatDateChange: P.func
}

export default RepeatOptions
