import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import ReactPagination from 'react-js-pagination'
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/fa'

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
    console.log(items.count, items.limit, { activePage })
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
            <span className={styles.flexCenter}>
              <FaAngleLeft className="mr-1" /> Prev
            </span>
          }
          nextPageText={
            <span className={styles.flexCenter}>
              Next <FaAngleRight className="ml-1" />
            </span>
          }
          firstPageText={
            <span className={styles.flexCenter}>
              <FaAngleDoubleLeft className="mr-1" /> First
            </span>
          }
          lastPageText={
            <span className={styles.flexCenter}>
              Last <FaAngleDoubleRight className="ml-1" />
            </span>
          }
          innerClass={styles.paginationContentInner}
          itemClass={styles.paginationContentItem}
          activeLinkClass={styles.paginationItemActive}
          disabledClass={styles.paginationItemActive}
        />
      </div>

      <div className={styles.paginationLimitContainer}>
        <FormSelect
          value={limitOptions.filter(item => item.value === limit)}
          options={limitOptions}
          onChange={onLimitChange}
          noCloseIcon
        />
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
