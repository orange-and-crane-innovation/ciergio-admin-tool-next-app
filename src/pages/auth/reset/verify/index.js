import { gql, useLazyQuery } from '@apollo/client'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

import showToast from '@app/utils/toast'

import VerifyCode from '@app/components/pages/auth/reset-password/verify'

const VERIFY_CODE_QUERY = gql`
  query getResetPasswordToken($where: GetResetPasswordTokenParams) {
    getResetPasswordToken(where: $where) {
      token
      status
    }
  }
`

function VerifyPage() {
  const router = useRouter()

  const [getToken, { loading, data, error }] = useLazyQuery(VERIFY_CODE_QUERY, {
    onError: _e => {}
  })

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      }
      if (data) {
        if (data?.getResetPasswordToken?.status === 'active') {
          localStorage.setItem(
            'reset_token',
            data?.getResetPasswordToken?.token
          )
          router.replace('/auth/reset/password')
        } else {
          showToast('danger', 'Code is invalid')
        }
      }
    }
  }, [loading, data, error])

  const onSubmit = useCallback(
    values => {
      try {
        getToken({
          variables: {
            where: values
          }
        })
      } catch (err) {}
    },
    [getToken]
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

  return <VerifyCode onSubmit={onSubmit} isSubmitting={loading} />
}

export default VerifyPage
