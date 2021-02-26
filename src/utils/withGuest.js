import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import PageLoader from '@app/components/page-loader'

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
  const GuestComponent = props => {
    const [loaded, setLoaded] = useState(false)
    const router = useRouter()
    const { loading, data } = useQuery(verifySession, {
      onError: () => {}
    })

    useEffect(() => {
      if (!loading) {
        if (data) {
          router.replace('/dashboard')
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
