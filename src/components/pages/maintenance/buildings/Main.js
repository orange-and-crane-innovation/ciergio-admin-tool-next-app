import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'
import { useQuery } from '@apollo/client'
import { GET_BUILDINGS } from '../queries'

function Main() {
  const { query } = useRouter()
  const { data, loading } = useQuery(GET_BUILDINGS, {
    variables: {
      complexId: query?.complexId
    }
  })

  const buildingsData = useMemo(() => {
    return {
      count: data?.getBuildings?.data?.length || 0,
      limit: 50,
      data:
        data?.getBuildings?.data?.length > 0
          ? data.getBuildings.data.map(({ _id, name }) => ({
              name: (
                <Link
                  href={`/maintenance?complexId=${query?.complexId}&buildingId=${_id}`}
                >
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
