import Datetime from 'react-datetime'
import Button from '@app/components/button'
import 'react-datetime/css/react-datetime.css'
import styles from './main.module.css'
import FormInput from '@app/components/forms/form-input'
import { friendlyDateTimeFormat } from '@app/utils/date'
import P from 'prop-types'
import SearchControl from '@app/components/globals/SearchControl'

function SelectDate({
  date,
  handleDateChange,
  search,
  handleSearchChange,
  showTableData,
  handleClear
}) {
  return (
    <>
      <div className="flex flex-row w-full justify-between my-10">
        <div className="flex flex-row w-full mx-4">
          <div className={styles.DateTimeContainer}>
            <p className={styles.DateTimeHeader}>Date</p>
            <Datetime
              renderInput={(props, openCalendar) => (
                <>
                  <div className="relative">
                    <FormInput
                      inputClassName={styles.DataTime}
                      name="input-datetime"
                      value={friendlyDateTimeFormat(date, 'MMMM DD, YYYY')}
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
              initialValue={friendlyDateTimeFormat(new Date(), 'MMMM DD, YYYY')}
              dateFormat="MMM DD, YYYY"
              timeFormat={false}
              value={date}
              onChange={handleDateChange}
              disabled="true"
            />
          </div>
          <div className="flex items-end">
            <Button default label="Show" onClick={showTableData} />
          </div>
        </div>

        <div className={styles.SearchControlTextContainer}>
          <SearchControl
            placeholder="Search by title"
            searchText={search}
            onSearch={handleSearchChange}
            className={styles.SearchControl}
            onClearSearch={handleClear}
          />
        </div>
      </div>
    </>
  )
}

SelectDate.propTypes = {
  date: P.oneOfType[(P.string, P.date)],
  handleDateChange: P.func.isRequired,
  search: P.string.isRequired,
  handleSearchChange: P.func.isRequired,
  showTableData: P.func.isRequired,
  handleClear: P.func.isRequired
}

export default SelectDate
