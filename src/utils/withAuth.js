import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const ME_QUERY = gql`
  query Authenticate {
    getProfile {
      _id
      avatar
      firstName
      lastName
      email
      contactNo
      jobTitle
      status
      createdAt
      updatedAt
    }
  }
`

const withAuth = WrappedComponent => {
  const AuthComponent = props => {
    const [loaded, setLoaded] = useState(false)
    const router = useRouter()
    const { loading, error } = useQuery(ME_QUERY, {
      onError: () => {},
      onCompleted: ({ getProfile }) => {
        localStorage.setItem('profile', getProfile)
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
      return <div>Loading</div>
    }

    return <WrappedComponent {...props} />
  }

  return AuthComponent
}

export default withAuth
