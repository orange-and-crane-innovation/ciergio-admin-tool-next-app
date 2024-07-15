import { gql, useMutation, useQuery } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import showToast from '@app/utils/toast'

import DeleteAccount from '@app/components/pages/auth/delete-account'

const DELETE_MY_MUTATION = gql`
  mutation deleteAccountByEmail($data: InputDeleteAccountByEmail) {
    deleteAccountByEmail(data: $data) {
      processId
      message
    }
  }
`
const GET_COMPANY = gql`
  query getCompanyPublic($id: String) {
    getCompanyPublic(_id: $id) {
      _id
      name
      avatar
      status
    }
  }
`

function DeleteAccountPage() {
  const { query } = useRouter()
  const companyId = query.companyId
  const [isDeleted, setIsDeleted] = useState(false)
  const [companyDetails, setCompanyDetails] = useState(null)

  console.log('companyId', companyId)

  const [
    deleteMyAccount,
    { loading, data, called, error }
  ] = useMutation(DELETE_MY_MUTATION, { onError: _e => {} })

  const { data: company, error: companyError } = useQuery(GET_COMPANY, {
    variables: { id: companyId },
    enabled: false
  })

  useEffect(() => {
    if (company?.getCompanyPublic) setCompanyDetails(company?.getCompanyPublic)
  }, [company])

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      }
      if (called && data) {
        showToast('success', 'Account has been deleted!')
        setIsDeleted(true)
        // const timer = setTimeout(() => {
        //   router.replace('/auth/login')
        //   clearInterval(timer)
        // }, 1000)
      }
    }
  }, [loading, called, data, error])

  const onSubmit = useCallback(
    values => {
      try {
        deleteMyAccount({
          variables: {
            data: values
          }
        })
      } catch (err) {}
    },
    [deleteMyAccount]
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

  return (
    <DeleteAccount
      company={companyDetails}
      onSubmit={onSubmit}
      isSubmitting={loading}
      isDeleted={isDeleted}
    />
  )
}

export default DeleteAccountPage
