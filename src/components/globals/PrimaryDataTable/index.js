import P from 'prop-types'
import Pagination from '@app/components/pagination'
import Table from '@app/components/table'

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
  customBody,
  className = ''
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
          className={className}
        />
      ) : (
        <Table
          rowNames={columns}
          items={data}
          loading={loading}
          emptyText={emptyText}
          className={className}
        />
      )}

      {!loading && data?.count !== 0 && (
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
  customBody: P.object,
  className: P.string
}

export default PrimaryDataTable
