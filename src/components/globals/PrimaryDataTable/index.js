import P from 'prop-types'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'

function PrimaryDataTable({
  columns,
  data,
  loading,
  currentPage,
  onPageChange,
  onPageLimitChange
}) {
  return (
    <>
      <Table rowNames={columns} items={data} loading={loading} />
      {!loading && data && (
        <div className="px-8">
          <Pagination
            items={data}
            activePage={currentPage}
            onPageClick={onPageChange}
            onLimitChange={onPageLimitChange}
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
  onPageChange: P.func,
  onPageLimitChange: P.func
}

export default PrimaryDataTable
