import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as GraphQLVar from './schema-varibles'

import PageLoader from '@app/components/page-loader'

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

const withAuth = WrappedComponent => {
  const AuthComponent = props => {
    const [loaded, setLoaded] = useState(false)
    const router = useRouter()
    const { loading, error } = useQuery(verifySession, {
      onError: () => {},
      onCompleted: ({ getProfile }) => {
        localStorage.setItem('profile', JSON.stringify(getProfile))
      }
    })

    useEffect(() => {
      if (!loading) {
        if (error) {
          router.replace({
            pathname: '/auth/login',
            // TODO: We can create settings to set the redirect page
            query: { redirectUrl: router.pathname || '/' }
          })
        } else {
          setLoaded(true)
        }
      }
    }, [error, loading, router])

    if (loading || !loaded) {
      return <PageLoader />
    }

    return <WrappedComponent {...props} />
  }

  return AuthComponent
}

export default withAuth
