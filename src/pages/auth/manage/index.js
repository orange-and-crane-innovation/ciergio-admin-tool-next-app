import { gql, useMutation } from '@apollo/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import showToast from '@app/utils/toast'

import ManageAccount from '@app/components/pages/auth/manage'

const SWITCH_ACCOUNT_MUTATION = gql`
  mutation switchAccount($data: InputSwitchAccount) {
    switchAccount(data: $data) {
      processId
      message
      slave
    }
  }
`

function ManageAccountPage() {
  const router = useRouter()

  const [
    switchAccount,
    { loading, data, called, error }
  ] = useMutation(SWITCH_ACCOUNT_MUTATION, { onError: _e => {} })

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

  const onSwitchAccount = id => {
    switchAccount({
      variables: {
        data: {
          accountId: id
        }
      }
    })
  }

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

  return <ManageAccount onSubmit={onSwitchAccount} isSubmitting={loading} />
}

export default ManageAccountPage
