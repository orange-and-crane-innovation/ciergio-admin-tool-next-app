import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import PageLoader from '@app/components/page-loader'

import { ACCOUNT_TYPES } from '@app/constants'

const verifySession = gql`
  query {
    getProfile {
      _id
      email
      avatar
      firstName
      lastName
      birthDate
      contactNo
      jobTitle
      status
      address {
        line1
        line2
        city
        province
        zipCode
        country
      }
      createdAt
      updatedAt
      accounts {
        count
        limit
        skip
        data {
          _id
          accountType
          status
          active
          notificationSettings {
            _id
            messages
            announcement
            myDues
            repairAndMaintenanceUpdates
            extensionAccountRequests
            promotions
          }
        }
      }
    }
  }
`

const withGuest = WrappedComponent => {
  const system = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const isSystemPray = system === 'pray'

  const GuestComponent = props => {
    const [loaded, setLoaded] = useState(false)
    const router = useRouter()
    const { loading, data } = useQuery(verifySession, {
      onError: () => {}
    })

    useEffect(() => {
      if (!loading) {
        if (data) {
          const profile = data ? data.getProfile : {}
          const accountType = profile?.accounts?.data[0]?.accountType

          if (isSystemPray && accountType !== ACCOUNT_TYPES.SUP.value) {
            router.push('/messages')
          } else {
            router.push('/properties')
          }
        } else {
          setLoaded(true)
        }
      }
    }, [data, loading, router])

    if (loading || !loaded) {
      return <PageLoader />
    }

    return <WrappedComponent {...props} />
  }

  return GuestComponent
}

export default withGuest
