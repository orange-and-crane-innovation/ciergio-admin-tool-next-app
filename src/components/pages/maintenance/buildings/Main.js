import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'
import { useQuery } from '@apollo/client'
import { GET_BUILDINGS } from '../queries'

function Main() {
  const router = useRouter()
  const companyId = router?.query?.companyId
  const complexId = router?.query?.complexId
  const originPath = router?.pathname?.split('/')[1]
  const { data, loading } = useQuery(GET_BUILDINGS, {
    fetchPolicy: 'network-only',
    variables: {
      where: {
        status: 'active',
        complexId
      }
    }
  })

  const getNextPath = id => {
    let path = originPath
    if (originPath === 'residents') {
      if (originPath === 'residents') {
        const residentsPath = router?.pathname?.split('/')[2]
        if (residentsPath === 'all-residents') {
          path = 'residents/all-residents'
        } else {
          path = 'residents/invites-requests'
        }
      }
    }

    return `/${path}?companyId=${companyId}&complexId=${complexId}&buildingId=${id}`
  }

  const buildingsData = useMemo(() => {
    return {
      count: data?.getBuildings?.data?.length || 0,
      limit: 50,
      data:
        data?.getBuildings?.data?.length > 0
          ? data.getBuildings.data.map(({ _id, name }) => ({
              name: (
                <Link href={getNextPath(_id)}>
                  <span className="text-secondary-500 hover:underline hover:cursor-pointer">
                    {name}
                  </span>
                </Link>
              )
            }))
          : []
    }
  }, [data?.getBuildings])

  return (
    <div className="content-wrap">
      <Card
        noPadding
        content={
          <Table
            rowNames={[
              {
                name: 'Building Name',
                width: ''
              }
            ]}
            items={buildingsData}
            loading={loading}
          />
        }
        className="rounded-t-none"
      />
    </div>
  )
}

export default Main
