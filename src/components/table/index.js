import PropTypes from 'prop-types'
import React from 'react'
import styles from './table.module.css'

import { BiLoaderAlt } from 'react-icons/bi'

const Table = ({
  custom,
  customHeader,
  customBody,
  rowNames,
  items,
  onRowClick,
  loading,
  emptyText
}) => {
  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <BiLoaderAlt className="animate-spin text-4xl text-gray-500" />
      </div>
    )
  }
  let listItem = []
  return (
    <div className={styles.tableContainer}>
      <table id="table" className={styles.tableControl}>
        <thead className={styles.tableHeader}>
          <tr>
            {rowNames &&
              rowNames.map((item, index) => {
                if (!item.hidden) {
                  return (
                    <th key={index} width={item.width}>
                      {item.name}
                    </th>
                  )
                } else {
                  return false
                }
              })}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {custom
            ? customBody
            : items &&
              items.data &&
              items.data.map((item, index) => {
                listItem = Object.entries(item).map(
                  ([key, value], rowIndex) => {
                    if (value !== false && key !== 'id') {
                      return <td key={rowIndex}>{value}</td>
                    }
                    return null
                  }
                )

                return (
                  <tr
                    key={index}
                    data-id={item?.id ?? index}
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

          {listItem.length === 0 && (customBody?.length === 0 || !customBody) && (
            <tr>
              <td
                className="border px-8 py-4 text-center"
                colSpan={rowNames?.length}
              >
                {emptyText || 'No data'}
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
  onRowClick: PropTypes.func,
  loading: PropTypes.bool,
  emptyText: PropTypes.node || PropTypes.string
}

export default Table
