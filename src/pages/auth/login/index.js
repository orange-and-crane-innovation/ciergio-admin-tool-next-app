import { useCallback } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'

import Login from '@app/components/pages/login'

const HELLO_QUERY = gql`
  query Hello {
    message
  }
`

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    Login(email: $email, password: $password) {
      user {
        id
        firstName
        lastName
        fullName
      }
      token
    }
  }
`

function LoginPage(props) {
  console.log('props', props)

  const { data: queryData } = useQuery(HELLO_QUERY)

  console.log('queryData', queryData)

  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
    onError: _e => {
      // do nothing
    }
  })

  console.log('data', data)
  console.log('loading', loading)
  console.log('error', error?.message)

  const onLoginSubmit = useCallback(
    values => {
      // console.log('values', values)
      try {
        login({
          variables: {
            ...values
          }
        })
      } catch (err) {
        console.log('error', err)
      }
    },
    [login]
  )

  return <Login onLoginSubmit={onLoginSubmit} />
}

export default LoginPage
