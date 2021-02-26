import { gql, useMutation } from '@apollo/client'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

import showToast from '@app/utils/toast'

import Login from '@app/components/pages/auth/login'

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      processId
      message
      slave
    }
  }
`

function LoginPage() {
  const router = useRouter()
  const [login, { loading, data, client, called, error }] = useMutation(
    LOGIN_MUTATION,
    {
      onError: _e => {},
      onCompleted: ({ login }) => {
        localStorage.setItem('keep', login.slave)
        client.resetStore()
      }
    }
  )

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      }
      if (called && data) {
        router.replace('/dashboard')
      }
    }
  }, [loading, called, data, error, router])

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

      if (networkError) {
        showToast('danger', errors?.networkError?.result?.errors[0]?.message)
      }

      if (message) {
        showToast('danger', message)
      }
    }
  }

  return <Login onLoginSubmit={onLoginSubmit} isSubmitting={loading} />
}

export default LoginPage
