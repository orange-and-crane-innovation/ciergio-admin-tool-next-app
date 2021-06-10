import { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

import showToast from '@app/utils/toast'
import { ACCOUNT_TYPES } from '@app/constants'

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
  const [accountType, setAccountType] = useState()
  const system = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const isSystemPray = system === 'pray'
  const isSystemCircle = system === 'circle'

  const [switchAccount, { loading, data, called, error }] = useMutation(
    SWITCH_ACCOUNT_MUTATION,
    { onError: () => {} }
  )

  useEffect(() => {
    if (loading) {
      showToast('info', 'Switching Account...')
    } else if (!loading) {
      if (error) {
        errorHandler(error)
      }
      if (called && data) {
        localStorage.setItem('keep', data?.switchAccount?.slave)
        const timer = setTimeout(() => {
          if (isSystemPray && accountType !== ACCOUNT_TYPES.SUP.value) {
            router.push('/messages')
          } else if (
            isSystemCircle &&
            accountType !== ACCOUNT_TYPES.SUP.value
          ) {
            router.push('/attractions-events')
          } else {
            router.push('/properties')
          }
          clearInterval(timer)
        }, 1000)
      }
    }
  }, [loading, called, data, error])

  const onSwitchAccount = (id, accountType) => {
    setAccountType(accountType)
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

  return <ManageAccount onSubmit={onSwitchAccount} isSubmitting={loading} />
}

export default ManageAccountPage
