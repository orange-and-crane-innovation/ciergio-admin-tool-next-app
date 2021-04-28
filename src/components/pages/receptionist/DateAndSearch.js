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
  handleClear,
  noDate
}) {
  return (
    <>
      <div className="flex flex-row w-full justify-between my-10">
        {!noDate && (
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
                initialValue={friendlyDateTimeFormat(
                  new Date(),
                  'MMMM DD, YYYY'
                )}
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
        )}
        <div
          className={
            !noDate
              ? styles.SearchControlTextContainer
              : 'flex w-full justify-end'
          }
        >
          <SearchControl
            placeholder="Search All"
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

SelectDate.defaultProps = {
  noDate: false
}

SelectDate.propTypes = {
  date: P.oneOfType[(P.string, P.date)],
  handleDateChange: P.func,
  search: P.string,
  handleSearchChange: P.func,
  showTableData: P.func,
  handleClear: P.func,
  noDate: P.bool.isRequired
}

export default SelectDate
