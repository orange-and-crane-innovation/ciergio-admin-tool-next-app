import { gql, useMutation } from '@apollo/client'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

import Login from '@app/components/pages/login'

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
  const [login, { loading, data, client }] = useMutation(LOGIN_MUTATION, {
    onError: _e => {},
    onCompleted: ({ login }) => {
      localStorage.setItem('token', login.slave)
      client.resetStore()
    }
  })

  useEffect(() => {
    if (!loading && data) {
      router.replace('/dashboard')
    }
  }, [data, loading, router])

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

  return <Login onLoginSubmit={onLoginSubmit} isSubmitting={loading} />
}

export default LoginPage
