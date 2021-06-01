import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'
import { useQuery } from '@apollo/client'
import { GET_COMPANIES } from '../queries'

function Main() {
  const router = useRouter()
  const originPath = router?.pathname?.split('/')[1]

  const { data, loading } = useQuery(GET_COMPANIES, {
    fetchPolicy: 'network-only',
    variables: {
      where: {
        status: 'active'
      }
    }
  })
  const getNextPath = id => {
    let path = originPath
    if (originPath === 'residents') {
      const residentsPath = router?.pathname?.split('/')[2]
      if (residentsPath === 'all-residents') {
        path = 'residents/all-residents'
      } else {
        path = 'residents/invites-requests'
      }
    }
    return `/${path}/complexes?companyId=${id}`
  }

  const complexesData = useMemo(() => {
    return {
      count: data?.getCompanies?.data?.length || 0,
      limit: 50,
      data:
        data?.getCompanies?.data?.length > 0
          ? data.getCompanies.data.map(({ _id, name }) => {
              const nextPath = getNextPath(_id)

              return {
                name: (
                  <Link href={nextPath}>
                    <span className="text-secondary-500 hover:underline hover:cursor-pointer">
                      {name}
                    </span>
                  </Link>
                )
              }
            })
          : []
    }
  }, [data?.getCompanies])

  return (
    <div className="content-wrap">
      <Card
        noPadding
        content={
          <Table
            rowNames={[
              {
                name: 'Companies Name',
                width: ''
              }
            ]}
            items={complexesData}
            loading={loading}
          />
        }
        className="rounded-t-none"
      />
    </div>
  )
}

export default Main
