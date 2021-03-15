import P from 'prop-types'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'

function PrimaryDataTable({
  columns,
  data,
  loading,
  currentPage,
  setCurrentPage,
  setPageOffset,
  pageLimit,
  setPageLimit,
  emptyText
}) {
  const onPageClick = e => {
    setCurrentPage(e)
    setPageOffset(pageLimit * (e - 1))
  }

  const onLimitChange = limit => setPageLimit(Number(limit.value))

  return (
    <>
      <Table rowNames={columns} items={data} loading={loading} />
      {!loading && data && (
        <div className="px-8">
          <Pagination
            items={data}
            activePage={currentPage}
            onPageClick={onPageClick}
            onLimitChange={onLimitChange}
          />
        </div>
      )}
    </>
  )
}

PrimaryDataTable.propTypes = {
  columns: P.array.isRequired,
  data: P.object.isRequired,
  loading: P.bool.isRequired,
  currentPage: P.number,
  pageLimit: P.number,
  setCurrentPage: P.func,
  setPageOffset: P.func,
  setPageLimit: P.func,
  emptyText: P.oneOfType([P.element, P.node, P.string])
}

export default PrimaryDataTable
