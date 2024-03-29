import { useState, useCallback, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { ACCOUNT_TYPES } from '@app/constants'

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
        existingUser
        jobTitle
        companyRole {
          name
        }
        company {
          name
        }
        complex {
          _id
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
  const [done, setDone] = useState(false)

  const { loading, data, error } = useQuery(VERIFY_CODE_QUERY, {
    onError: _e => {},
    skip: router.query.code === undefined,
    variables: {
      where: {
        code: router.query.code,
        appType: 'admin'
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
          if (profile?.accountType === ACCOUNT_TYPES.MEM.value) {
            setDone(true)
          } else {
            router.replace('/auth/login')
          }
          clearInterval(timer)
        }, 1000)
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate])

  const onSubmit = useCallback(
    values => {
      const createData = {
        code: router.query.code
      }

      if (!profile?.existingUser) {
        createData.data = {
          firstName: values?.firstName,
          lastName: values?.lastName,
          password: values?.password
        }
      }

      try {
        createAccount({
          variables: createData
        })
      } catch (err) {}
    },
    [router, profile, createAccount]
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
    <Join
      onSubmit={onSubmit}
      isLoading={loading}
      isSubmitting={loadingCreate}
      done={done}
      data={profile}
    />
  )
}

export default JoinPage
