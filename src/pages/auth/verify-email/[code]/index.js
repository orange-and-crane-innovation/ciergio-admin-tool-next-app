import { useState, useCallback, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

import showToast from '@app/utils/toast'

import VerifyEmail from '@app/components/pages/auth/verify-email'

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($token: String) {
    verifyEmail(data: { token: $token }) {
      processId
      message
      companyLogo
    }
  }
`

function VerifyEmailPage() {
  const router = useRouter()
  const [verify, setVerify] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [errorData, setErrorData] = useState()

  const [
    verifyEmail,
    { loading, data, called, error }
  ] = useMutation(VERIFY_EMAIL_MUTATION, { onError: _e => {} })

  useEffect(() => {
    if (router?.query?.code) {
      setIsLoading(true)

      const timer = setTimeout(() => {
        onSubmit()
        clearTimeout(timer)
      }, 2000)
    }
  }, [router])

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
        setIsLoading(false)
      }
      if (called && data) {
        setVerify(data?.verifyEmail)
        setIsLoading(false)
      }
    }
  }, [loading, called, data, error])

  const onSubmit = useCallback(() => {
    try {
      verifyEmail({
        variables: {
          token: router.query.code
        }
      })
    } catch (err) {}
  }, [verifyEmail, router])

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))
    console.log(errors)
    if (errors) {
      const { graphQLErrors, networkError, message } = errors
      if (graphQLErrors) {
        setErrorData(
          graphQLErrors.map(({ code, message }) => {
            return {
              code,
              message
            }
          })
        )
      }

      if (networkError?.result?.errors) {
        setErrorData({
          code: errors?.networkError?.result?.errors[0]?.code,
          message: errors?.networkError?.result?.errors[0]?.message
        })
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

  return (
    <VerifyEmail
      loading={isLoading || loading}
      data={verify}
      error={errorData}
    />
  )
}

export default VerifyEmailPage
