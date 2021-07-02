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
  emptyText,
  customize,
  customBody
}) {
  const onPageClick = e => {
    setCurrentPage(e)
    setPageOffset(pageLimit * (e - 1))
  }

  const onLimitChange = limit => {
    setCurrentPage(1)
    setPageOffset(0)
    setPageLimit(Number(limit.value))
  }

  return (
    <>
      {customize ? (
        <Table
          loading={loading}
          rowNames={columns}
          custom={customize}
          customBody={customBody}
          emptyText={emptyText}
        />
      ) : (
        <Table
          rowNames={columns}
          items={data}
          loading={loading}
          emptyText={emptyText}
        />
      )}

      {!loading && data?.count > 10 && (
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
  emptyText: P.oneOfType([P.element, P.node, P.string]),
  customize: P.bool,
  customBody: P.object
}

export default PrimaryDataTable
