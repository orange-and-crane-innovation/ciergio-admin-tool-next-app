import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import ReactPagination from 'react-js-pagination'

import FormSelect from '@app/components/forms/form-select'

import styles from './pagination.module.css'

const Pagination = ({ items, activePage, onPageClick, onLimitChange }) => {
  const [totalCount, setTotalCount] = useState(0)
  const [limit, setLimit] = useState(10)
  const [listStart, setListStart] = useState(0)
  const [listEnd, setListEnd] = useState(0)

  const limitOptions = [
    {
      label: 'Show 10',
      value: 10
    },
    {
      label: 'Show 20',
      value: 20
    },
    {
      label: 'Show 30',
      value: 30
    },
    {
      label: 'Show 40',
      value: 40
    },
    {
      label: 'Show 50',
      value: 50
    },
    {
      label: 'Show 100',
      value: 100
    }
  ]

  useEffect(() => {
    const offsetInit = items.limit * activePage
    const offsetFinal = offsetInit - items.limit

    setLimit(items.limit)
    setTotalCount(items.count)
    setListStart(items.count > 0 ? offsetFinal + 1 : 0)
    setListEnd(items.data.length + offsetFinal)
  }, [items, activePage])

  return (
    <div className={styles.paginationContainer}>
      <div>
        Showing {listStart} - {listEnd} out of {totalCount}
      </div>
      <div className={styles.paginationContent}>
        <ReactPagination
          activePage={activePage}
          itemsCountPerPage={limit}
          totalItemsCount={totalCount}
          pageRangeDisplayed={5}
          onChange={onPageClick}
          prevPageText={
            <span>
              <i className="fa fa-angle-left"></i> Prev
            </span>
          }
          nextPageText={
            <span>
              Next <i className="fa fa-angle-right"></i>
            </span>
          }
          firstPageText={
            <span>
              <i className="fa fa-angle-double-left"></i> First
            </span>
          }
          lastPageText={
            <span>
              Last <i className="fa fa-angle-double-right"></i>
            </span>
          }
          innerClass={styles.paginationContentInner}
          itemClass={styles.paginationContentItem}
          activeLinkClass={styles.paginationItemActive}
          disabledClass={styles.paginationItemActive}
        />
      </div>
      <div>
        <FormSelect options={limitOptions} onChange={onLimitChange} />
      </div>
    </div>
  )
}

Pagination.propTypes = {
  items: PropTypes.object,
  activePage: PropTypes.number,
  onPageClick: PropTypes.func,
  onLimitChange: PropTypes.func
}

export default Pagination
