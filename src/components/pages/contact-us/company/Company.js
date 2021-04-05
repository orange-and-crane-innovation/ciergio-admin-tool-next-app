import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import P from 'prop-types'

import { Card } from '@app/components/globals'
import Table from '@app/components/table'

import { initializeApollo } from '@app/lib/apollo/client'
import { GET_COMPANY, GET_COMPLEXES, GET_COMPANIES } from '../queries'

const columns = [
  {
    name: 'Name',
    width: ''
  }
]

function Company({ id }) {
  const { data: complexes, loading: loadingComplexes } = useQuery(
    GET_COMPLEXES,
    {
      variables: {
        where: {
          companyId: id
        }
      }
    }
  )
  const { data: companies } = useQuery(GET_COMPANY, {
    variables: { companyId: id }
  })

  const contactsData = useMemo(
    () => ({
      count: complexes?.getComplexes.count || 0,
      limit: complexes?.getComplexes.limit || 0,
      data:
        complexes?.getComplexes?.data?.map(item => {
          return {
            name: (
              <Link href={`/contact-us/complex/${item._id}?companyId=${id}`}>
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
      <h1 className="content-title capitalize">{`${name} Contact Page`}</h1>
      <div className="flex items-center justify-between bg-white border rounded-t">
        <h1 className="font-bold text-base px-8 py-4">Complexes</h1>
      </div>
      <Card
        noPadding
        content={
          <Table
            rowNames={columns}
            items={contactsData}
            loading={loadingComplexes}
          />
        }
        className="rounded-t-none"
      />
    </section>
  )
}

Company.propTypes = {
  id: P.string
}

const apolloClient = initializeApollo()

export async function getStaticPaths() {
  const companies = await apolloClient.query({
    query: GET_COMPANIES
  })

  const paths = companies?.getCompanies?.data.map(c => ({
    params: { id: c._id }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  await apolloClient.query({
    query: GET_COMPANY,
    variables: { companyId: params.id }
  })

  await apolloClient.query({
    query: GET_COMPLEXES
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  }
}

export default Company
