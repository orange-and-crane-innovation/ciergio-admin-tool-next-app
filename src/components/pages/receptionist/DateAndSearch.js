import Datetime from 'react-datetime'
import Button from '@app/components/button'
import 'react-datetime/css/react-datetime.css'
import styles from './main.module.css'
import FormInput from '@app/components/forms/form-input'
import { toFriendlyShortDate } from '@app/utils/date'
import P from 'prop-types'
import SearchControl from '@app/components/globals/SearchControl'
import Can from '@app/permissions/can'

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
      <div className="flex flex-col w-full items-end justify-between mb-2 md:flex-row">
        {!noDate && (
          <div className="flex items-end justify-center w-full md:mr-4 md:justify-start">
            <div className={styles.DateTimeContainer}>
              <p className={styles.DateTimeHeader}>Date</p>
              <Datetime
                renderInput={(props, openCalendar) => (
                  <>
                    <div
                      className="relative cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyDown={() => {}}
                      onClick={openCalendar}
                    >
                      <FormInput
                        inputClassName={styles.DataTime}
                        name="input-datetime"
                        value={toFriendlyShortDate(date)}
                        onChange={() => {}}
                        readOnly
                      />
                      <span
                        className="ciergio-calendar absolute top-3 right-4 cursor-pointer h-full"
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => {}}
                        onClick={openCalendar}
                      />
                    </div>
                  </>
                )}
                initialValue={toFriendlyShortDate(new Date())}
                dateFormat="MMM DD, YYYY"
                timeFormat={false}
                value={date}
                onChange={handleDateChange}
                disabled="true"
                closeOnSelect
              />
            </div>
            <div className="flex items-end">
              <Can
                perform="guestanddeliveries:view"
                yes={<Button default label="Show" onClick={showTableData} />}
              />
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
