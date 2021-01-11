/* eslint-disable react/display-name */
import React, { forwardRef, useEffect, useRef } from 'react'
import P from 'prop-types'
import { useTable, useRowSelect, useSortBy } from 'react-table'

import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { GoKebabHorizontal } from 'react-icons/go'

import Pagination from '../pagination'

const Component = ({
  columns,
  payload,
  headerClassNames,
  pagination,
  rowSelection,
  enableSorting,
  onRowClick,
  emptyText
}) => {
  const data = payload.data
  const tableInstance = useTable(
    { columns, data },
    useSortBy,
    useRowSelect,
    hooks => {
      if (!rowSelection) return null

      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: HeaderIndeterminateCheckbox,
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: CellIndeterminateCheckbox
        },
        ...columns
      ])
    }
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows
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
                      {...(enableSorting
                        ? column.getHeaderProps(column.getSortByToggleProps())
                        : column.getHeaderProps())}
                      className={`font-bold text-neutral-500 border-b border-gray-200 py-4 pl-8 text-left ${headerClassNames}`}
                    >
                      <div className="flex justify-start align-center">
                        {
                          <span>
                            {
                              // Render the header
                              column.render('Header')
                            }
                          </span>
                        }
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaChevronDown className="relative top-1 left-1" />
                            ) : (
                              <FaChevronUp className="relative top-1 left-1" />
                            )
                          ) : (
                            ''
                          )}
                        </span>
                      </div>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()} className="pb-4">
          {rows?.length > 0 ? ( // Loop over the table rows
            rows.map((row, rowIndex) => {
              // Prepare the row for display
              prepareRow(row)
              return (
                // Apply the row props
                <tr
                  key={rowIndex}
                  {...row.getRowProps()}
                  onClick={() => {
                    if (!onRowClick) return null

                    onRowClick(row.original)
                  }}
                >
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
          ) : (
            <tr>
              <td className="px-8 py-4 text-center" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {pagination ? (
        <div className="px-4">
          <Pagination
            items={payload}
            activePage={1}
            onPageClick={e => alert('Page ' + e)}
            onLimitChange={e => alert('Show ' + e.target.value)}
          />
        </div>
      ) : null}
    </div>
  )
}

const IndeterminateCheckbox = forwardRef((obj, ref) => {
  const { indeterminate, ...rest } = obj
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  )
})

const HeaderIndeterminateCheckbox = ({ getToggleAllRowsSelectedProps }) => (
  <div>
    <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
  </div>
)

const CellIndeterminateCheckbox = ({ row }) => (
  <div>
    <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
  </div>
)

export const Action = ({ value }) => {
  return (
    <div className="w-full flex justify-end pr-8">
      <GoKebabHorizontal onClick={() => console.log({ value })} />
    </div>
  )
}

Action.propTypes = {
  value: P.object
}

HeaderIndeterminateCheckbox.propTypes = {
  getToggleAllRowsSelectedProps: P.func
}

CellIndeterminateCheckbox.propTypes = {
  row: P.object
}

Component.defaultProps = {
  emptyText: 'No Data'
}

Component.propTypes = {
  columns: P.array || P.object,
  payload: P.object,
  headerClassNames: P.string,
  pagination: P.object || P.bool,
  rowSelection: P.bool,
  enableSorting: P.bool,
  onRowClick: P.func,
  emptyText: P.string
}

export default Component
