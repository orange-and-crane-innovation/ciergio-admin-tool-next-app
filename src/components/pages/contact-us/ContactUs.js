/* eslint-disable react/jsx-key */
import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { Card, Tabs } from '@app/components/globals'
import Table from '@app/components/table'

import { initializeApollo } from '@app/lib/apollo/client'

import { GET_COMPANIES } from './queries'

const columns = [
  {
    name: 'Name',
    width: ''
  }
]

function ContactUs() {
  const { data: companies } = useQuery(GET_COMPANIES)

  const companiesData = useMemo(
    () => ({
      count: companies?.getCompanies.count || 0,
      limit: companies?.getCompanies.limit || 0,
      data:
        companies?.getCompanies?.data?.map(item => {
          return {
            name: (
              <Link legacyBehavior href={`/contact-us/companies/${item._id}`}>
                <span className="text-blue-600 cursor-pointer">
                  {item.name}
                </span>
              </Link>
            )
          }
        }) || []
    }),
    [companies?.getCompanies]
  )

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title">Contact Page</h1>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Contacts</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-base px-8 py-4">Companies</h1>
            </div>
            <Card
              noPadding
              header={
                <div className="flex items-center justify-between">
                  <span>Companies</span>
                </div>
              }
              content={<Table rowNames={columns} items={companiesData} />}
              className="rounded-t-none"
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GET_COMPANIES
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  }
}

export default ContactUs
