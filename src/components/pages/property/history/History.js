import Table from '@app/components/table'
import Card from '@app/components/card'
import Pagination from '@app/components/pagination'

const ROWS = [
  {
    name: 'Date',
    width: '20%'
  },
  {
    name: 'User',
    width: '20%'
  },
  {
    name: 'Property',
    width: '20%'
  },
  {
    name: 'Activity',
    width: '40%'
  }
]
// this is temp
const dummyItems = {
  count: 0,
  limit: 0,
  offset: 0,
  data: []
}

const HistoryTab = () => {
  return (
    <div>
      <Card
        header={<h2 className="font-bold text-lg">History</h2>}
        content={<Table rowNames={ROWS} items={dummyItems} />}
      />
      <Pagination items={dummyItems} activePage={0} />
    </div>
  )
}

export { HistoryTab }
