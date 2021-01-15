import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as GraphQLVar from './schema-varibles'

const verifySession = gql`
    query {
      getProfile{
        ${GraphQLVar.User}
        accounts {
          ${GraphQLVar.Page}
          data {
            ${GraphQLVar.UserAccount}
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
      return <div>Loading</div>
    }

    return <WrappedComponent {...props} />
  }

  return GuestComponent
}

export default withGuest
