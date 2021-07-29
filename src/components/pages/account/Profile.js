/* eslint-disable react/jsx-key */
import React, { useMemo, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { FiMail, FiLock, FiUser, FiEdit2 } from 'react-icons/fi'

import Card from '@app/components/card'
import PageHeader from '@app/components/page-header'
import PageLoader from '@app/components/page-loader'

import getAccountTypeName from '@app/utils/getAccountTypeName'
import errorHandler from '@app/utils/errorHandler'
import { IMAGES, ACCOUNT_TYPES } from '@app/constants'

import EditModal from './components/EditModal'

import styles from './Profile.module.css'
import gql from 'graphql-tag'
import showToast from '@app/utils/toast'

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
        avatar: data?.logo[0],
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
                <span>{getAccountTypeName(account[0].accountType)}</span>
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
