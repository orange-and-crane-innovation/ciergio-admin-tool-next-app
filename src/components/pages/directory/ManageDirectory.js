import React, { useEffect } from 'react'
import P from 'prop-types'
import { Draggable } from '@app/components/globals'
import Pagination from '@app/components/pagination'

const directoryRowNames = [
  {
    name: 'Reorder',
    width: '10%'
  },
  {
    name: 'Category'
  },
  {
    name: '',
    width: '5%'
  }
]

function ManageDirectory({
  data,
  currentPage,
  pageLimit,
  setPageOffset,
  setCurrentPage,
  setPageLimit
}) {
  const [list, setList] = React.useState([])

  useEffect(() => {
    setList(data?.data)
  }, [data?.data])

  const onPageClick = e => {
    setCurrentPage(e)
    setPageOffset(pageLimit * (e - 1))
  }

  const onLimitChange = limit => setPageLimit(Number(limit.value))

  return (
    <>
      <Draggable
        list={list}
        onListChange={setList}
        rowNames={directoryRowNames}
      />
      <div className="px-4">
        <Pagination
          items={data}
          activePage={currentPage}
          onPageClick={onPageClick}
          onLimitChange={onLimitChange}
        />
      </div>
    </>
  )
}

ManageDirectory.propTypes = {
  data: P.object,
  currentPage: P.number,
  pageLimit: P.number,
  setPageOffset: P.func,
  setCurrentPage: P.func,
  setPageLimit: P.func
}

export default ManageDirectory
