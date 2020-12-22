import Pagination from '@app/components/pagination'
import Highlight from './highlight'

const PaginationPage = () => {
  const data = {
    count: 161,
    limit: 10,
    offset: 0,
    data: {
      length: 10
    }
  }

  return (
    <div className="flex">
      <div className="w-full p-8">
        <Pagination
          items={data}
          activePage={1}
          onPageClick={e => alert('Page ' + e)}
          onLimitChange={e => alert('Show ' + e.target.value)}
        />

        <br />

        <Highlight
          code={`
            // Data array should have count, limit, offset, data: length
            const data = {
              count: 161,
              limit: 10,
              offset: 0,
              data: {
                length: 10
              }
            }

            <Pagination 
              items={data}
              activePage={1} 
              onPageClick={e => alert('Page ' + e)}
              onLimitChange={e => alert('Show ' + e.target.value)}
            />
          `}
        />
      </div>
    </div>
  )
}

export default PaginationPage
