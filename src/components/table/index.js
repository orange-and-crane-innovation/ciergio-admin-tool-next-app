import PropTypes from 'prop-types'
import React from 'react'
import styles from './table.module.css'

const Table = ({
  custom,
  customHeader,
  customBody,
  rowNames,
  items,
  onRowClick
}) => {
  let listItem = []
  return (
    <div className={styles.tableContainer}>
      <table className={styles.tableControl}>
        <thead className={styles.tableHeader}>
          {custom ? (
            customHeader
          ) : (
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
          )}
        </thead>
        <tbody className={styles.tableBody}>
          {custom
            ? customBody
            : items &&
              items.data &&
              items.data.map((item, index) => {
                listItem = Object.entries(item).map(
                  ([key, value], rowIndex) => {
                    if (key !== 'id') {
                      return <td key={rowIndex}>{value}</td>
                    }
                    return null
                  }
                )

                return (
                  <tr
                    key={index}
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(item)
                      }

                      return null
                    }}
                  >
                    {listItem}
                  </tr>
                )
              })}

          {!custom && listItem.length === 0 && (
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
  custom: PropTypes.bool,
  customHeader: PropTypes.any,
  customBody: PropTypes.any,
  rowNames: PropTypes.array,
  items: PropTypes.object,
  onRowClick: PropTypes.func
}

export default Table
