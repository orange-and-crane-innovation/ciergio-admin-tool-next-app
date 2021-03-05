import { useState, useCallback, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

import showToast from '@app/utils/toast'

import Join from '@app/components/pages/auth/join'

const VERIFY_CODE_QUERY = gql`
  query getRegistrationCodes($where: GetRegistrationCodesParams!) {
    getRegistrationCodes(where: $where) {
      count
      limit
      skip
      data {
        code
        firstName
        lastName
        email
        accountType
        company {
          name
        }
        complex {
          name
        }
        building {
          name
        }
      }
    }
  }
`

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($data: InputUser, $code: String) {
    createAccount(data: $data, code: $code) {
      processId
      message
    }
  }
`

function JoinPage() {
  const router = useRouter()
  const [profile, setProfile] = useState()

  const { loading, data, error } = useQuery(VERIFY_CODE_QUERY, {
    onError: _e => {},
    variables: {
      where: {
        code: router.query.code
      }
    }
  })

  const [
    createAccount,
    {
      loading: loadingCreate,
      data: dataCreate,
      called: calledCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_ACCOUNT_MUTATION, { onError: _e => {} })

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      }
      if (data) {
        setProfile(data?.getRegistrationCodes?.data[0])
      }
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(errorCreate)
      }
      if (calledCreate && dataCreate) {
        showToast('success', 'Successfully registered')

        const timer = setTimeout(() => {
          router.replace('/auth/login')
          clearInterval(timer)
        }, 1000)
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate])

  const onSubmit = useCallback(
    values => {
      try {
        createAccount({
          variables: {
            data: {
              firstName: values?.firstName,
              lastName: values?.lastName,
              password: values?.password
            },
            code: router.query.code
          }
        })
      } catch (err) {}
    },
    [createAccount]
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

  return <Join onSubmit={onSubmit} isSubmitting={loading} data={profile} />
}

export default JoinPage
