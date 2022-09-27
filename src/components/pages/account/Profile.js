import { ACCOUNT_TYPES, IMAGES } from '@app/constants'
import { FiEdit2, FiLock, FiMail, FiUser } from 'react-icons/fi'
/* eslint-disable react/jsx-key */
import React, { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import Card from '@app/components/card'
import EditModal from './components/EditModal'
import PageHeader from '@app/components/page-header'
import PageLoader from '@app/components/page-loader'
import errorHandler from '@app/utils/errorHandler'
import getAccountTypeName from '@app/utils/getAccountTypeName'
import gql from 'graphql-tag'
import showToast from '@app/utils/toast'
import styles from './Profile.module.css'

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
          active
          accountType
          companyRoleId
          companyRole {
            _id
            name
            status
            permissions {
              group
              accessLevel
            }
          }
          accountType
          active
        }
      }
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation updateUser($userId: String, $data: InputUpdateUser) {
    updateUser(userId: $userId, data: $data) {
      processId
      message
      slave
    }
  }
`

function Profile() {
  const [showModal, setShowModal] = useState(false)

  const { loading, data, refetch } = useQuery(GET_PROFILE, {
    fetchPolicy: 'cache-only',
    onError: () => {}
  })

  const [updateUser, { loading: loadingUpdate }] = useMutation(
    UPDATE_USER_MUTATION,
    {
      onCompleted: () => {
        showToast('success', 'Profile updated successfully!')
        handleShowModal()
        refetch()
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )

  const profile = useMemo(() => {
    return data ? data?.getProfile : {}
  }, [data])

  const account = useMemo(() => {
    return profile?.accounts?.data?.length > 0
      ? profile.accounts.data.filter(account => account.active === true)
      : []
  }, [profile])

  const handleShowModal = () => {
    setShowModal(old => !old)
  }

  const onSubmit = data => {
    const updateData = {
      userId: data?.id,
      data: {
        avatar: data?.logo ? data?.logo[0] : null,
        firstName: data?.firstName,
        lastName: data?.lastName
      }
    }
    updateUser({ variables: updateData })
  }

  const DropdownData = [
    {
      label: 'Edit Profile',
      icon: <FiEdit2 />,
      function: () => handleShowModal()
    }
  ]

  if (loading) return <PageLoader />

  return (
    <div className={styles.PageContainer}>
      <PageHeader
        image={
          profile?.avatar
            ? profile?.avatar
            : account[0].accountType === ACCOUNT_TYPES.SUP
            ? IMAGES.ADMIN_AVATAR
            : account[0].accountType === ACCOUNT_TYPES.COMPYAD
            ? IMAGES.COMPANY_AVATAR
            : account[0].accountType === ACCOUNT_TYPES.COMPXAD
            ? IMAGES.COMPLEX_AVATAR
            : IMAGES.DEFAULT_AVATAR
        }
        title={`${profile.firstName} ${profile.lastName}`}
        subtitle={profile.email}
        dropdown={DropdownData}
      />
      <Card
        noPadding
        header={
          <div className={styles.FlexCenterBetween}>
            <span className={styles.CardHeader}>About</span>
          </div>
        }
        content={
          <div className={styles.CardContentContainer}>
            <div className={styles.CardSubContentContainer}>
              <span>
                <FiUser />
              </span>
              <div className={styles.FlexCol}>
                <span className={styles.ContentTitle}>Account Type</span>
                <span>{getAccountTypeName(account[0])}</span>
              </div>
            </div>
            <hr />
            <div className={styles.CardSubContentContainer}>
              <span>
                <FiMail />
              </span>
              <div className={styles.FlexCol}>
                <span className={styles.ContentTitle}>Email</span>
                <span>{profile ? profile.email : '--'}</span>
              </div>
            </div>
            <hr />
            <div className={styles.CardSubContentContainer}>
              <span>
                <FiLock />
              </span>
              <div className={styles.FlexCol}>
                <span className={styles.ContentTitle}>Status</span>
                <span>{profile.status}</span>
              </div>
            </div>
          </div>
        }
      />

      <EditModal
        data={profile}
        isShown={showModal}
        loading={loadingUpdate}
        onSave={e => onSubmit(e)}
        onCancel={handleShowModal}
      />
    </div>
  )
}

export default Profile
