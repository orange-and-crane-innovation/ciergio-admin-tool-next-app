import P from 'prop-types'
import { useRouter } from 'next/router'

import Table from '@app/components/table'
import { Card } from '@app/components/globals'

const tableRowData = [
  {
    name: 'Name'
  }
]

const tableData = {
  count: 161,
  limit: 10,
  offset: 0,
  data: [
    {
      title: 'Red Cross'
    },
    {
      title: 'PRHC Headquarters'
    },
    {
      title: 'McDonalds'
    },
    {
      title: 'Suds Laundry Services'
    }
  ]
}

function Company({ name }) {
  const router = useRouter()

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title capitalize">{`${name} Directory`}</h1>
      <div className="flex items-center justify-between bg-white border rounded-t">
        <h1 className="font-bold text-base px-8 py-4">Complexes</h1>
      </div>
      <Card
        noPadding
        content={
          <Table
            rowNames={tableRowData}
            items={tableData}
            onRowClick={item => {
              const contact = item.title.toLowerCase().replaceAll(' ', '-')

              router.push(`directory/complex/${contact}`)
            }}
          />
        }
        className="rounded-t-none"
      />
    </section>
  )
}

Company.propTypes = {
  name: P.string
}

export default Company
