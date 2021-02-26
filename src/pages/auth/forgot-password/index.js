import { gql, useMutation } from '@apollo/client'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

import showToast from '@app/utils/toast'

import ForgotPassword from '@app/components/pages/auth/forgot-password'

const FORGOT_PASSWORD_MUTATION = gql`
  mutation forgotPassword($data: InputForgotPassword) {
    forgotPassword(data: $data) {
      processId
      message
    }
  }
`

function ForgotPasswordPage() {
  const router = useRouter()

  const [
    forgotPassword,
    { loading, data, called, error }
  ] = useMutation(FORGOT_PASSWORD_MUTATION, { onError: _e => {} })

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      }
      if (called && data) {
        showToast(
          'success',
          'Your password reset was sent successfully, please check your email.'
        )

        const timer = setTimeout(() => {
          router.replace('/auth/reset/verify')
          clearInterval(timer)
        }, 1000)
      }
    }
  }, [loading, called, data, error])

  const onSubmit = useCallback(
    values => {
      try {
        forgotPassword({
          variables: {
            data: values
          }
        })
      } catch (err) {}
    },
    [forgotPassword]
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

  return <ForgotPassword onSubmit={onSubmit} isSubmitting={loading} />
}

export default ForgotPasswordPage
