import P from 'prop-types'

import Select from '@app/components/select'
import Button from '@app/components/button'

import { repeatEveryOptions, monthArrayFiller, days } from '../constants'

const styleClasses =
  'mr-1 mb-1 w-5 h-5 b-0 m-0 border py-5 px-6 flex items-center justify-center rounded-md'
const selectedClasses = 'bg-primary-500 text-white border-primary-500'
const defaultClasses = 'bg-white text-black border-neutral-300'

function CustomPublishDates({
  repeat,
  repeatOption,
  onSelectRepeatEveryOption,
  repeatEveryOption,
  onSelectDates,
  onSelectDay,
  weekdays,
  dates
}) {
  if (!repeat || repeatOption?.value !== 'custom') {
    return null
  }

  return (
    <>
      <div className="p-4">
        <div>
          <h4 className="text-base font-bold text-gray-500 mb-2">
            Repeat Every
          </h4>
          <div className="w-1/3 mb-2">
            <Select
              options={repeatEveryOptions}
              onChange={onSelectRepeatEveryOption}
              value={repeatEveryOption}
              isClearable={false}
            />
          </div>

          <div className="w-full">
            <h4 className="text-base font-bold text-gray-500 mb-2">
              Repeat On
            </h4>
            {repeatEveryOption?.value === 'weekly'
              ? days.map(({ label, value }) => (
                  <Button
                    key={value}
                    onClick={() => onSelectDay(value)}
                    primary={weekdays?.includes(value)}
                    label={label}
                    className="mr-1"
                  />
                ))
              : null}
            <div className="max-w-full w-full flex flex-1 flex-wrap">
              {repeatEveryOption?.value === 'monthly'
                ? monthArrayFiller.map(({ label, value }) => {
                    const bgClasses = dates?.includes(value)
                      ? selectedClasses
                      : defaultClasses

                    return (
                      <button
                        className={`${styleClasses} ${bgClasses}`}
                        onClick={() => onSelectDates(value)}
                        key={value}
                      >
                        {label}
                      </button>
                    )
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

CustomPublishDates.propTypes = {
  repeat: P.bool,
  repeatOption: P.oneOfType([P.object, P.array]),
  dates: P.array,
  weekdays: P.array,
  repeatEveryOption: P.oneOfType([P.object, P.array]),
  onSelectDates: P.func,
  onSelectDay: P.func,
  onSelectRepeatEveryOption: P.func
}

export default CustomPublishDates
