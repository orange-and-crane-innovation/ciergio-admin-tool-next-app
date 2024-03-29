import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

import { gql, useLazyQuery, useMutation } from '@apollo/client'
import Login from '@app/components/pages/auth/login'
import { ACCOUNT_TYPES } from '@app/constants'
import showToast from '@app/utils/toast'

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      processId
      message
      slave
    }
  }
`

export const GET_PROFILE = gql`
  query {
    getProfile {
      _id
      email
      avatar
      firstName
      lastName
      accounts {
        data {
          _id
          active
          accountType
          companyRoleId
          companyRole {
            _id
            name
            status
            permissions {
              group
              accessLevel
            }
          }
          accountType
          active
        }
      }
    }
  }
`

function LoginPage() {
  const router = useRouter()
  // const system = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  // const isSystemPray = system === 'pray'
  // const isSystemCircle = system === 'circle'

  const [login, { loading, data, client, called, error }] = useMutation(
    LOGIN_MUTATION,
    {
      onCompleted: ({ login }) => {
        localStorage.setItem('keep', login.slave)
        client.resetStore()
      },
      onError: () => {}
    }
  )

  const [
    getProfile,
    { loading: loadingProfile, data: dataProfile, error: errorProfile }
  ] = useLazyQuery(GET_PROFILE, {
    fetchPolicy: 'network-only',
    onError: error => {
      errorHandler(error)
    }
  })

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      }
      if (called && data) {
        getProfile()
      }
    }
  }, [loading, called, data, error])

  useEffect(() => {
    if (!loadingProfile) {
      if (errorProfile) {
        errorHandler(errorProfile)
      }
      if (dataProfile) {
        const profile = dataProfile ? dataProfile.getProfile : {}
        const accountType = profile?.accounts?.data[0]?.accountType

        // if (isSystemPray && accountType !== ACCOUNT_TYPES.SUP.value) {
        //   router.push('/posts')
        // } else if (isSystemCircle && accountType !== ACCOUNT_TYPES.SUP.value) {
        //   router.push('/attractions-events')
        // } else {
        //   router.push('/properties')
        // }

        if (accountType === ACCOUNT_TYPES.SUP.value) {
          router.push('/dashboard')
        } else {
          router.push('/account/profile')
        }
      }
    }
  }, [loadingProfile, dataProfile, errorProfile, router])

  const onLoginSubmit = useCallback(
    values => {
      try {
        login({
          variables: {
            ...values
          }
        })
      } catch (err) {}
    },
    [login]
  )

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError, message } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError?.result?.errors) {
        showToast('danger', errors?.networkError?.result?.errors[0]?.message)
      }

      if (
        message &&
        graphQLErrors?.length === 0 &&
        !networkError?.result?.errors
      ) {
        showToast('danger', message)
      }
    }
  }

  return <Login onLoginSubmit={onLoginSubmit} isSubmitting={loading} />
}

export default LoginPage
