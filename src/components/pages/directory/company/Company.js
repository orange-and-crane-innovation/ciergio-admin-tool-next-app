import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import P from 'prop-types'

import { Card } from '@app/components/globals'
import Table from '@app/components/table'

import { GET_COMPANY, GET_COMPLEXES } from '../queries'

const columns = [
  {
    name: 'Name',
    width: ''
  }
]

function Company({ id }) {
  const { data: complexes } = useQuery(GET_COMPLEXES, {
    variables: { companyId: id }
  })
  const { data: companies } = useQuery(GET_COMPANY, {
    variables: { companyId: id }
  })

  const directoryData = useMemo(
    () => ({
      count: complexes?.getComplexes.count || 0,
      limit: complexes?.getComplexes.limit || 0,
      data:
        complexes?.getComplexes?.data?.map(item => {
          return {
            name: (
              <Link href={`/directory/companies/${item._id}`}>
                <span className="text-blue-600 cursor-pointer">
                  {item.name}
                </span>
              </Link>
            )
          }
        }) || []
    }),
    [complexes?.getComplexes]
  )
  const name = companies?.getCompanies?.data[0]?.name
  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title capitalize">{`${name} Directory`}</h1>
      <div className="flex items-center justify-between bg-white border rounded-t">
        <h1 className="font-bold text-base px-8 py-4">Complexes</h1>
      </div>
      <Card
        noPadding
        content={<Table rowNames={columns} items={directoryData} />}
        className="rounded-t-none"
      />
    </section>
  )
}

Company.propTypes = {
  id: P.string
}

export default Company
