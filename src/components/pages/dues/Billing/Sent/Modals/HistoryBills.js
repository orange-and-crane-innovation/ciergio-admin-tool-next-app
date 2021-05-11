import P from 'prop-types'
import styles from './style.module.css'
import { toFriendlyDate } from '@app/utils/date'

export default function HistoryBills({ dues }) {
  return (
    <>
      <div className="row py-7">
        <div className="tabled-group tabled-group-bordered text-left border-0 col-md-12">
          <div className="tabled-content form-group">
            {dues &&
              dues.map((due, index) => {
                return (
                  <div key={index} className="tabled-item item w-full">
                    <span className="text-gray-700 text-md font-bold inline-block w-1/2">
                      {toFriendlyDate(due.dueDate)}
                    </span>
                    <span className="text-gray-700 text-md font-bold inline-block w-1/2">
                      {due.category.name}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
      <div className={`row   ${styles.rowUnderline}`}>
        <div className="table-responsive">
          <div className="table w-full table-striped border-b-2 border-gray-500">
            <span className="text-gray-500 font-bold text-sm flex-grow w-1/2 inline-block">
              Date
            </span>
            <span className="text-gray-500 font-bold text-sm flex-grow w-1/2 inline-block">
              Activity
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

HistoryBills.propTypes = {
  dues: P.array.isRequired
}
