import React from 'react'
import P from 'prop-types'
import { useRouter } from 'next/router'

import { Card, Table } from '@app/components/globals'

function Company({ name }) {
  const router = useRouter()

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      }
    ],
    []
  )

  const tableData = React.useMemo(
    () => ({
      count: 161,
      limit: 10,
      offset: 0,
      data: [
        {
          name: 'Red Cross'
        },
        {
          name: 'PRHC Headquarters'
        },
        {
          name: 'McDonalds'
        },
        {
          name: 'Suds Laundry Services'
        }
      ]
    }),
    []
  )

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
            columns={columns}
            payload={tableData}
            onRowClick={item => {
              const contact = item.name.toLowerCase().replaceAll(' ', '-')

              router.push(`/directory/complex/${contact}`)
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
