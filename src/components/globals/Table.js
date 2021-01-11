import React from 'react'
import P from 'prop-types'
import { useTable } from 'react-table'

const Component = ({ columns, data, headerClassNames }) => {
  const tableInstance = useTable({ columns, data })
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance

  return (
    // apply the table props
    <div className="pb-4 bg-white">
      <table {...getTableProps()} className="w-full">
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup, index) => (
              // Apply the header row props
              <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column, idx) => (
                    // Apply the header cell props
                    <th
                      key={idx}
                      {...column.getHeaderProps()}
                      className={`font-bold text-black border-b border-gray-200 py-4 pl-8 text-left ${headerClassNames}`}
                    >
                      {
                        // Render the header
                        column.render('Header')
                      }
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()} className="pb-4">
          {
            // Loop over the table rows
            rows.map((row, rowIndex) => {
              // Prepare the row for display
              prepareRow(row)
              return (
                // Apply the row props
                <tr key={rowIndex} {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell, cellIndex) => {
                      // Apply the cell props
                      return (
                        <td
                          key={cellIndex}
                          {...cell.getCellProps()}
                          className={`pl-8 py-4 ${
                            rowIndex % 2 !== 0 ? 'bg-neutral-100' : 'bg-white'
                          }`}
                        >
                          {
                            // Render the cell contents
                            cell.render('Cell')
                          }
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

Component.propTypes = {
  columns: P.array || P.object,
  data: P.array,
  headerClassNames: P.string
}

export default Component
