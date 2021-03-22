import { useState } from 'react'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import styles from './main.module.css'
import FormInput from '@app/components/forms/form-input'
import { friendlyDateTimeFormat } from '@app/utils/date'
import SearchControl from '@app/components/globals/SearchControl'

function SelectDate() {
  const [search, setSearch] = useState()

  const onSearch = e => {
    setSearch(e.target.value)
  }

  const onClearSearch = e => {
    setSearch(null)
  }
  const [date, setDate] = useState(
    friendlyDateTimeFormat(new Date(), 'MMMM DD, YYYY')
  )
  const handleDateChange = date => {
    setDate(friendlyDateTimeFormat(date, 'MMMM DD, YYYY'))
  }

  return (
    <>
      <div className="flex flex-row w-full justify-between my-10">
        <div className={styles.DateTimeContainer}>
          <p className={styles.DateTimeHeader}>Date</p>
          <Datetime
            renderInput={(props, openCalendar) => (
              <>
                <div className="relative">
                  <FormInput
                    inputClassName={styles.DataTime}
                    name="input-datetime"
                    value={date}
                    readOnly
                  />
                  <span
                    className="ciergio-calendar absolute top-3 right-4 cursor-pointer h-full"
                    onClick={openCalendar}
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => {}}
                  />
                </div>
              </>
            )}
            dateFormat="MMM DD, YYYY"
            timeFormat={false}
            value={date}
            onChange={handleDateChange}
            disabled="true"
          />
        </div>
        <div className={styles.SearchControlTextContainer}>
          <SearchControl
            placeholder="Search by title"
            searchText={search}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
            className={styles.SearchControl}
          />
        </div>
      </div>
    </>
  )
}

export default SelectDate
