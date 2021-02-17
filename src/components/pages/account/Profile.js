/* eslint-disable react/jsx-key */
import React from 'react'
import { useQuery } from '@apollo/client'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'

import Card from '@app/components/card'
import PageHeader from '@app/components/page-header'

import styles from './Profile.module.css'
import gql from 'graphql-tag'

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

function Profile() {
  const { loading, data } = useQuery(GET_PROFILE, {
    fetchPolicy: 'cache-only'
  })
  if (loading) return <div>Loading...</div>
  const profile = data ? data.getProfile : {}

  const account = profile.accounts.data.filter(
    account => account.active === true
  )

  return (
    <div className={styles.PageContainer}>
      <PageHeader
        image={profile.avatar}
        title={`${profile.firstName} ${profile.lastName}`}
        subtitle={profile.email}
      />
      <Card
        noPadding
        header={
          <div className={styles.FlexCenterBetween}>
            <span className={styles.CardHeader}>About</span>
            {/* <span>test</span> */}
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
                <span>{account[0].accountType}</span>
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
    </div>
  )
}

export default Profile
