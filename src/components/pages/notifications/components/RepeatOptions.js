import P from 'prop-types'
import moment from 'moment'

import RadioBox from '@app/components/forms/form-radio'
import { DateInput } from '@app/components/datetime'
import FormInput from '@app/components/forms/form-input'

import { ATTR } from '@app/utils'

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
      {/* Removed: not supported in backend */}
      {/* <div className="w-1/4 mb-2">
        <RadioBox
          primary
          id="never"
          name="never"
          label="Never"
          value="never"
          onChange={onSelectRepeat}
          isChecked={repeatEndOption === 'never'}
        />
      </div> */}
      <div className="flex items-center mb-2 -mt-4">
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

        <div className="w-1/2 mt-4">
          <DateInput
            label=""
            disabled={repeatEndOption !== 'on'}
            date={repeatDate}
            onDateChange={onRepeatDateChange}
            dateFormat="MMMM DD, YYYY"
            minDate={new Date()}
          />
        </div>
      </div>
      <div className="flex items-center -mt-8">
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
        <div className="flex items-center w-36 mt-4">
          <FormInput
            type="text"
            value={instance}
            inputProps={{
              style: { paddingRight: '1rem', textAlign: 'right' }
            }}
            disabled={repeatEndOption !== 'after'}
            onChange={onChangeInstance}
            onKeyPress={ATTR.numericOnly}
            name="instances"
            maxLength={4}
          />
          <span className="-mt-4 ml-2"> instance</span>
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
  instance: P.oneOfType([P.number, P.string]),
  repeatDate: P.oneOfType([P.instanceOf(Date), P.instanceOf(moment)]),
  onRepeatDateChange: P.func
}

export default RepeatOptions
