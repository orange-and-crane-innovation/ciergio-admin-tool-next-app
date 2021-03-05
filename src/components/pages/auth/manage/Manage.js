/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client'
import P from 'prop-types'
import { FiMoreHorizontal, FiSettings } from 'react-icons/fi'

import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import CiergioMiniLogo from '@app/assets/svg/ciergio-mini.svg'
import PageLoader from '@app/components/page-loader'
import Dropdown from '@app/components/dropdown'

import { IMAGES, ACCOUNT_TYPES } from '@app/constants'
import getAccountTypeName from '@app/utils/getAccountTypeName'
import showToast from '@app/utils/toast'

import Userinfo from './components/user-info'
import CreateModal from './components/createAccount'

import style from './Manage.module.css'

export const GET_PROFILE = gql`
  query {
    getProfile {
      _id
      email
      avatar
      firstName
      lastName
      birthDate
      contactNo
      jobTitle
      status
      address {
        line1
        line2
        city
        province
        zipCode
        country
      }
      createdAt
      updatedAt
      accounts {
        count
        limit
        skip
        data {
          _id
          accountType
          active
          company {
            name
            avatar
          }
          complex {
            name
            avatar
          }
          building {
            name
            avatar
          }
        }
      }
    }
  }
`

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
      slave
    }
  }
`

function ManageAccount({ onSubmit, isSubmitting }) {
  const [showModal, setShowModal] = useState(false)
  const [profile, setProfile] = useState()

  const {
    loading: loadingProfile,
    data: dataProfile,
    error: errorProfile,
    refetch
  } = useQuery(GET_PROFILE, {
    fetchPolicy: 'cache-only'
  })

  const [verifyCode, { loading, data, error }] = useLazyQuery(
    VERIFY_CODE_QUERY,
    {
      onError: _e => {},
      fetchPolicy: 'network-only'
    }
  )

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
    if (!loadingProfile) {
      if (errorProfile) {
        errorHandler(errorProfile)
      }
      if (dataProfile) {
        setProfile(dataProfile?.getProfile)
      }
    }
  }, [loadingProfile, dataProfile, errorProfile])

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      }
      if (data) {
        const values = data?.getRegistrationCodes?.data[0]

        if (values) {
          createAccount({
            variables: {
              code: values.code
            }
          })
        } else {
          showToast('danger', 'Code is invalid')
        }
      }
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(errorCreate)
      }
      if (calledCreate && dataCreate) {
        if (dataCreate?.createAccount?.message === 'success') {
          handleClearModal()
          showToast('success', 'Successfully registered')
          localStorage.setItem('keep', dataCreate?.createAccount?.slave)
          refetch()
        } else {
          showToast('danger', 'Failed to register')
        }
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate])

  const dropdownData = [
    {
      label: 'Preferences',
      icon: <FiSettings />,
      function: () => {}
    },
    {
      label: 'Delete Account',
      icon: <span className="ciergio-trash" />,
      function: () => {}
    }
  ]

  const handleShowModal = () => {
    setShowModal(old => !old)
  }

  const handleClearModal = () => {
    handleShowModal()
  }

  const onCreateAccount = data => {
    verifyCode({
      variables: {
        where: {
          code: data.code
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

  return (
    <main className={style.ManageAccount}>
      <div className={style.ManageAccountWrapper}>
        <div className={style.LogoContainer}>
          <CiergioLogo className={style.Logo} />
        </div>

        <div className={style.ManageAccountCard}>
          {loadingProfile && <PageLoader />}
          {profile && (
            <>
              <div className={style.ManageAccountUserWrapper}>
                <span onClick={() => onSubmit()}>
                  <Userinfo
                    imgSrc={profile?.avatar ?? IMAGES.DEFAULT_AVATAR}
                    imgAlt={'Logo'}
                    userName={`${profile?.firstName} ${profile?.lastName}`}
                    userTitle={profile?.email}
                  />
                </span>
              </div>

              <br />
              <h2>Manage Accounts</h2>

              <div className={style.ManageAccountUserWrapper}>
                {profile?.accounts?.data?.map((item, index) => {
                  return (
                    index !== 0 &&
                    [
                      ACCOUNT_TYPES.SUP.value,
                      ACCOUNT_TYPES.COMPYAD.value,
                      ACCOUNT_TYPES.COMPXAD.value,
                      ACCOUNT_TYPES.BUIGAD.value
                    ].includes(item?.accountType) && (
                      <div className="relative">
                        <div key={index} onClick={() => onSubmit(item?._id)}>
                          <Userinfo
                            imgSrc={
                              item?.accountType === ACCOUNT_TYPES.COMPYAD.value
                                ? item?.company?.avatar ??
                                  IMAGES.PROPERTY_AVATAR
                                : item?.accountType ===
                                  ACCOUNT_TYPES.COMPXAD.value
                                ? item?.complex?.avatar ??
                                  IMAGES.PROPERTY_AVATAR
                                : item?.accountType ===
                                  ACCOUNT_TYPES.BUIGAD.value
                                ? item?.building?.avatar ??
                                  IMAGES.PROPERTY_AVATAR
                                : item?.company?.avatar ??
                                  IMAGES.PROPERTY_AVATAR
                            }
                            imgAlt={'Logo'}
                            userName={
                              item?.accountType === ACCOUNT_TYPES.COMPYAD.value
                                ? item?.company?.name
                                : item?.accountType ===
                                  ACCOUNT_TYPES.COMPXAD.value
                                ? item?.complex?.name
                                : item?.accountType ===
                                  ACCOUNT_TYPES.BUIGAD.value
                                ? item?.building?.name
                                : item?.company?.name
                            }
                            userTitle={getAccountTypeName(item?.accountType)}
                            size={'SM'}
                          />
                        </div>
                        <div className="absolute top-4 right-2">
                          <Dropdown
                            label={
                              <FiMoreHorizontal className="text-neutral-500" />
                            }
                            items={dropdownData}
                          />
                        </div>
                      </div>
                    )
                  )
                })}
              </div>

              <div className={style.ManageAccountUserWrapper}>
                <span onClick={() => handleShowModal()}>
                  <Userinfo
                    imgSrc={IMAGES.DEFAULT_AVATAR}
                    imgAlt={'Logo'}
                    userName="Add New Account"
                  />
                </span>
              </div>
            </>
          )}
        </div>

        <div className={style.MiniFooter}>
          <span>Powered by </span>
          <CiergioMiniLogo />
        </div>
      </div>

      <CreateModal
        title="Add Account"
        loading={loading}
        isShown={showModal}
        onSave={onCreateAccount}
        onCancel={handleClearModal}
      />
    </main>
  )
}

ManageAccount.defaultProps = {
  isSubmitting: false
}

ManageAccount.propTypes = {
  onSubmit: P.func.isRequired,
  isSubmitting: P.bool
}

export default ManageAccount
