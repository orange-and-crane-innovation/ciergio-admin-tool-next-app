/* eslint-disable no-unused-vars */
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect, useState, useContext } from 'react'
import * as GraphQLVar from './schema-varibles'

import PageLoader from '@app/components/page-loader'
import Notification from '@app/components/notification'

import { Context } from '@app/lib/global/store'
import { Subscribe } from '@app/lib/apollo/client'

const SubscribeInstance = new Subscribe()

const GET_PROFILE_QUERY = gql`
    query {
      getProfile{
        ${GraphQLVar.User}
        accounts {
          ${GraphQLVar.Page}
          data {
            ${GraphQLVar.UserAccount}
          }
        }
      }
    }
  `

export const NEW_MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription ($userId: String) {
    newMessageAdded(userId: $userId) {
      _id
      message
      status
      createdAt
      updatedAt
      author {
        _id
        accountType
        user {
          _id
          firstName
          lastName
        }
      }
      conversation {
        _id
      }
      viewers {
        count
        data {
          _id
          user {
            _id
            firstName
            lastName
          }
        }
      }
    }
  }
`

export const MESSAGE_UPDATED_SUBSCRIPTION = gql`
  subscription ($userId: String) {
    messageUpdated(userId: $userId) {
      _id
      message
      status
      createdAt
      updatedAt
    }
  }
`

export const EXTENSION_ACCOUN_REQUEST_RECEIVE_SUBSCRIPTION = gql`
  subscription ($userId: String) {
    extensionAccountRequestReceived(userId: $userId) {
      _id
      firstName
      lastName
      email
      note
      relationship
      from {
        user {
          firstName
          lastName
        }
      }
      unit {
        name
      }
    }
  }
`

export const NEW_WEB_NOTIFICATION_SUBSCRIPTION = gql`
  subscription ($accountId: String) {
    new_web_notification(accountId: $accountId) {
      _id
      type
      subType
      data {
        title
        message
        metadata
      }
    }
  }
`

export const GET_UNREAD_MESSAGE_QUERY = gql`
  query ($accountId: String) {
    getUnreadConversationCount(where: { accountId: $accountId })
  }
`

const withAuth = WrappedComponent => {
  const AuthComponent = props => {
    const router = useRouter()
    const [state, dispatch] = useContext(Context)
    const [loaded, setLoaded] = useState(false)
    const [notification, setNotification] = useState({
      title: '',
      message: ''
    })
    const isBrowser = typeof window !== 'undefined'
    const user = isBrowser && JSON.parse(localStorage.getItem('profile'))
    const activeAccount = user?.accounts?.data[0]

    const { loading, error } = useQuery(GET_PROFILE_QUERY, {
      fetchPolicy: 'network-only',
      onCompleted: ({ getProfile }) => {
        localStorage.setItem('profile', JSON.stringify(getProfile))
        SubscribeInstance.connect()
        newMessageSubscription()
        newExtensionRequestSubscription()
      },
      onError: () => {}
    })

    const newMessageSubscription = () => {
      const user = isBrowser && JSON.parse(localStorage.getItem('profile'))
      const activeAccount = user?.accounts?.data[0]

      SubscribeInstance.getClient()
        .subscribe({
          query: NEW_MESSAGE_ADDED_SUBSCRIPTION,
          variables: {
            userId: user?._id
          }
        })
        .subscribe({
          next({ data }) {
            const { newMessageAdded: newData } = data
            const isMine = newData?.author?._id === activeAccount?._id

            if (!isMine && newData !== null) {
              const name = `New message - ${newData?.author?.user?.firstName} ${newData?.author?.user?.lastName}`
              const message = newData?.message

              dispatch({ type: 'UPDATE_NEW_MSG', payload: newData })
              showNotification(name, message)
              refetchConvo()
            }
          }
        })
    }

    const newExtensionRequestSubscription = () => {
      const user = isBrowser && JSON.parse(localStorage.getItem('profile'))
      SubscribeInstance.getClient()
        .subscribe({
          query: EXTENSION_ACCOUN_REQUEST_RECEIVE_SUBSCRIPTION,
          variables: {
            userId: user?._id
          }
        })
        .subscribe({
          next({ data }) {
            const { extensionAccountRequestReceived: newData } = data
            if (newData !== null) {
              const name = `Unit ${newData?.unit?.name} - ${newData?.from?.user?.firstName} ${newData?.from?.user?.lastName}`
              const message = `Received an account extension request for ${newData?.firstName} ${newData?.lastName}`

              showNotification(name, message)
            }
          }
        })
    }

    const {
      loading: loadingConvo,
      data: dataConvo,
      error: errorConvo,
      refetch: refetchConvo
    } = useQuery(GET_UNREAD_MESSAGE_QUERY, {
      skip: activeAccount?._id === undefined,
      fetchPolicy: 'network-only',
      variables: {
        accountId: activeAccount?._id
      }
    })

    useEffect(() => {
      if (!loading) {
        if (error) {
          localStorage.removeItem('keep')
          localStorage.removeItem('profile')

          router.replace({
            pathname: '/auth/login',
            // TODO: We can create settings to set the redirect page
            query: { redirectUrl: router.pathname || '/' }
          })
        } else {
          setLoaded(true)
        }
      }
    }, [error, loading, router])

    useEffect(() => {
      if (!loadingConvo) {
        if (errorConvo) {
          console.log(errorConvo)
        }
        if (dataConvo) {
          const unreadMsg = dataConvo?.getUnreadConversationCount
          dispatch({ type: 'UPDATE_UNREAD_MSG', payload: unreadMsg })
        }
      }
    }, [errorConvo, loadingConvo, dataConvo])

    const showNotification = (title, message) => {
      setNotification({
        title,
        message
      })
    }

    const closeNotification = () => {
      setNotification({
        title: '',
        message: ''
      })
    }

    if (loading || !loaded) {
      return <PageLoader fullPage />
    }

    return (
      <>
        <WrappedComponent {...props} />
        <Notification
          title={notification?.title}
          message={notification?.message}
          onCloseNotification={closeNotification}
        />
      </>
    )
  }

  return AuthComponent
}

export default withAuth
