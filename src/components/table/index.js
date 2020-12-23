import React from 'react'
import PropTypes from 'prop-types'

import styles from './table.module.css'

const Table = ({ rowNames, items }) => {
  let listItem = []
  return (
    <div className={styles.tableContainer}>
      <table className={styles.tableControl}>
        <thead className={styles.tableHeader}>
          <tr>
            {rowNames &&
              rowNames.map((item, index) => {
                return (
                  <th key={index} width={item.width}>
                    {item.name}
                  </th>
                )
              })}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {items &&
            items.data &&
            items.data.map((item, index) => {
              listItem = Object.entries(item).map(([key, value], rowIndex) => {
                return <td key={rowIndex}>{value}</td>
              })

              return <tr key={index}>{listItem}</tr>
            })}

          {listItem.length === 0 && (
            <tr>
              <td
                className="border px-8 py-4 text-center"
                colSpan={rowNames.length}
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

Table.propTypes = {
  rowNames: PropTypes.array,
  items: PropTypes.object
}

export default Table
