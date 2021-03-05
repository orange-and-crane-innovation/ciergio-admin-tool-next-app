import { gql, useMutation } from '@apollo/client'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

import showToast from '@app/utils/toast'

import ResetPassword from '@app/components/pages/auth/reset-password/password'

const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($data: InputResetPassword) {
    resetPassword(data: $data) {
      processId
      message
    }
  }
`

function ResetPasswordPage() {
  const router = useRouter()

  const [resetPassword, { loading, data, called, error }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      onError: _e => {}
    }
  )

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      }
      if (called && data) {
        if (data?.resetPassword.message === 'success') {
          showToast(
            'success',
            'You successfully created a new password. Please log in to view your dashboard!'
          )

          const timer = setTimeout(() => {
            router.replace('/auth/login')
            clearInterval(timer)
          }, 1000)
        } else {
          showToast('danger', 'Password reset failed')
        }
      }
    }
  }, [loading, called, data, error, router])

  const onSubmit = useCallback(
    values => {
      try {
        resetPassword({
          variables: {
            data: values
          }
        })
      } catch (err) {}
    },
    [resetPassword]
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

  return <ResetPassword onSubmit={onSubmit} isSubmitting={loading} />
}

export default ResetPasswordPage
