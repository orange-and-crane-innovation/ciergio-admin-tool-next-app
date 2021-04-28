import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { GET_COMPLEXES } from '../../queries'
import Card from '@app/components/card'
import Table from '@app/components/table'

export default function Complexes() {
  const user = JSON.parse(localStorage.getItem('profile'))
  const companyId = user?.accounts?.data[0]?.company?._id
  const { data: complexes, loading: loadingComplexes } = useQuery(
    GET_COMPLEXES,
    {
      variables: {
        where: {
          companyId: companyId
        }
      }
    }
  )

  const complexesData = useMemo(
    () => ({
      count: complexes?.getComplexes?.count || 0,
      limit: complexes?.getComplexes?.limit || 0,
      data:
        complexes?.getComplexes?.count > 0
          ? complexes.getComplexes.data.map(item => {
              return {
                name: (
                  <Link href={`/prayer-requests/list?complexId=${item._id}`}>
                    <span className="text-blue-600 cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                )
              }
            })
          : []
    }),
    [complexes?.getComplexes?.count]
  )

  return (
    <div className="content-wrap">
      <Card
        content={
          <Table
            rowNames={[
              {
                name: 'Complex Name',
                width: ''
              }
            ]}
            items={complexesData}
            loading={loadingComplexes}
          />
        }
      />
    </div>
  )
}
