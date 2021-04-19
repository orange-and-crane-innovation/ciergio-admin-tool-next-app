import React, { useMemo } from 'react'
import P from 'prop-types'
import { useRouter } from 'next/router'
import { gql, useQuery, useMutation } from '@apollo/client'

import showToast from '@app/utils/toast'

import Unsubscribe from '@app/components/pages/auth/unsubscribe'
import PageLoader from '@app/components/page-loader'
import PageNotFound from '@app/components/page-not-found'
import { cloneDeep } from 'lodash'

const GET_EMAIL_SUBSCRIPTION_QUERY = gql`
  query getEmailSubscriptions($where: GetEmailSubscriptionParams) {
    getEmailSubscriptions(where: $where) {
      count
      limit
      skip
      data {
        _id
        user {
          _id
          firstName
          lastName
          email
        }
        bulletin
        guestAndDeliveries
        issue
        mydues
      }
    }
  }
`

const UNSUBSCRIBE_MUTATION = gql`
  mutation updateEmailSubscription(
    $data: UpdateEmailSubscription!
    $userId: String
  ) {
    updateEmailSubscription(data: $data, userId: $userId) {
      _id
      processId
      message
    }
  }
`

const UnsubscribePage = () => {
  const { isFallback, query } = useRouter()

  const { loading, error, data } = useQuery(GET_EMAIL_SUBSCRIPTION_QUERY, {
    skip: query.id === undefined,
    variables: { where: { userId: query.id } }
  })

  const [updateEmailSubscription] = useMutation(UNSUBSCRIBE_MUTATION, {
    context: {
      clientType: 'mutation'
    }
  })

  const email = useMemo(
    () => data?.getEmailSubscriptions?.data[0]?.user?.email,
    [data]
  )

  const toggleData = useMemo(() => {
    return [
      {
        name: 'bulletin',
        title: 'Bulletin Board',
        description: 'The latest updates and events in your building.',
        status: data?.getEmailSubscriptions.data[0]?.bulletin || false
      },
      {
        name: 'issue',
        title: 'Maintenance and Repairs',
        description: 'Receive updates from your submitted tickets.',
        status: !!data?.getEmailSubscriptions.data[0]?.issue || false
      },
      {
        name: 'mydues',
        title: 'My Dues',
        description: 'Bills and reminders.',
        status: !!data?.getEmailSubscriptions.data[0]?.mydues || false
      },

      {
        name: 'guestAndDeliveries',
        title: 'Guest and Deliveries',
        description: 'Be notified when a guest has arrived.',
        status:
          !!data?.getEmailSubscriptions.data[0]?.guestAndDeliveries || false
      }
    ]
  }, [data])

  const onToggleSubscription = type => {
    const payload = {
      data: { [type]: !toggleData.find(item => item.name === type)?.status },
      userId: query.id
    }

    updateEmailSubscription({
      variables: payload,
      update: proxy => {
        const data = proxy.readQuery({
          query: GET_EMAIL_SUBSCRIPTION_QUERY,
          variables: { where: { userId: query.id } }
        })

        const updatedData = cloneDeep(data)
        updatedData.getEmailSubscriptions.data[0][type] = payload.data[type]

        proxy.writeQuery({
          query: GET_EMAIL_SUBSCRIPTION_QUERY,
          data: {
            ...updatedData
          }
        })
      }
    })
      .then(() => {
        showToast('success', 'Successfully Updated!')
      })
      .catch(err => {
        showToast('danger', err.message)
      })
  }

  if (isFallback || loading) {
    return <PageLoader />
  }

  if (error || data?.getEmailSubscriptions?.data?.length <= 0) {
    return <PageNotFound message="This account doesn't exist." />
  }

  return (
    <Unsubscribe
      email={email}
      onToggle={onToggleSubscription}
      toggleData={toggleData}
    />
  )
}

UnsubscribePage.propTypes = {
  unsubscribeEmail: P.object
}

export default UnsubscribePage
