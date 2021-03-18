import { useMemo } from 'react'
import Link from 'next/link'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'
import { useQuery } from '@apollo/client'
import { GET_COMPLEXES } from '../queries'

function Main() {
  const user = JSON.parse(localStorage.getItem('profile'))
  const { data } = useQuery(GET_COMPLEXES, {
    variables: {
      companyId: user?.accounts?.data[0]?.companyId
    }
  })

  const complexesData = useMemo(() => {
    return {
      count: data?.getComplexes?.data?.length || 0,
      limit: 50,
      data:
        data?.getComplexes?.data?.length > 0
          ? data.getComplexes.data.map(({ _id, name }) => ({
              name: (
                <Link href={`/maintenance/buildings?complexId=${_id}`}>
                  {name}
                </Link>
              )
            }))
          : []
    }
  }, [data?.getComplexes])

  return (
    <div className="content-wrap">
      <Card
        noPadding
        content={
          <Table
            rowNames={[
              {
                name: 'Complex Name',
                width: ''
              }
            ]}
            items={complexesData}
          />
        }
        className="rounded-t-none"
      />
    </div>
  )
}

export default Main
