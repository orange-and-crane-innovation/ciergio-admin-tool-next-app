import { useQuery, useSubscription, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect, useState, useContext } from 'react'
import * as GraphQLVar from './schema-varibles'

import PageLoader from '@app/components/page-loader'
import Notification from '@app/components/notification'

import { Context } from '@app/lib/global/store'

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
  subscription($userId: String) {
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
  subscription($userId: String) {
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
  subscription($userId: String) {
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
  subscription($accountId: String) {
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
  query($accountId: String) {
    getUnreadConversationCount(where: { accountId: $accountId })
  }
`

const withAuth = WrappedComponent => {
  const AuthComponent = props => {
    const router = useRouter()
    // eslint-disable-next-line no-unused-vars
    const [state, dispatch] = useContext(Context)
    const [loaded, setLoaded] = useState(false)
    const [notificationTitle, setNotificationTitle] = useState('')
    const [notificationMessage, setNotificationMessage] = useState()
    const isBrowser = typeof window !== 'undefined'
    const user = isBrowser && JSON.parse(localStorage.getItem('profile'))
    const activeAccount = user?.accounts?.data[0]

    const { loading, error } = useQuery(GET_PROFILE_QUERY, {
      onError: () => {},
      onCompleted: ({ getProfile }) => {
        localStorage.setItem('profile', JSON.stringify(getProfile))
      }
    })

    const {
      data: dataSubNewMessage,
      loading: loadingSubNewMessage,
      error: errorSubNewMessage
    } = useSubscription(NEW_MESSAGE_ADDED_SUBSCRIPTION, {
      skip: user?._id === undefined,
      variables: {
        userId: user?._id
      }
    })

    const {
      data: dataSubExtensionRequest,
      loading: loadingSubExtensionRequest,
      error: errorSubExtensionRequest
    } = useSubscription(EXTENSION_ACCOUN_REQUEST_RECEIVE_SUBSCRIPTION, {
      skip: user?._id === undefined,
      variables: {
        userId: user?._id
      }
    })

    const {
      loading: loadingConvo,
      data: dataConvo,
      error: errorConvo,
      refetch: refetchConvo
    } = useQuery(GET_UNREAD_MESSAGE_QUERY, {
      skip: activeAccount?._id === null,
      fetchPolicy: 'network-only',
      variables: {
        accountId: activeAccount?._id
      }
    })

    useEffect(() => {
      if (!loading) {
        if (error) {
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
      if (errorSubNewMessage) {
        console.log(errorSubNewMessage)
      }
      if (dataSubNewMessage) {
        const data = dataSubNewMessage?.newMessageAdded
        const name = `New message - ${data?.author?.user?.firstName} ${data?.author?.user?.lastName}`
        const message = data?.message
        const isMine = data?.author?._id === activeAccount?._id

        if (!isMine) {
          dispatch({ type: 'UPDATE_NEW_MSG', payload: data })
          refetchConvo()
          showNotification(name, message)
        }
      }
    }, [dataSubNewMessage, loadingSubNewMessage, errorSubNewMessage])

    useEffect(() => {
      if (errorSubExtensionRequest) {
        console.log(errorSubExtensionRequest)
      }
      if (dataSubExtensionRequest) {
        console.log(dataSubExtensionRequest)
        const data = dataSubExtensionRequest?.extensionAccountRequestReceived
        const name = `Unit ${data?.unit?.name} - ${data?.from?.user?.firstName} ${data?.from?.user?.lastName}`
        const message = `Received an account extension request for ${data?.firstName} ${data?.lastName}`

        showNotification(name, message)
      }
    }, [
      dataSubExtensionRequest,
      loadingSubExtensionRequest,
      errorSubExtensionRequest
    ])

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

    const showNotification = (title, msg) => {
      setNotificationTitle(title)
      setNotificationMessage(msg)
    }

    const closeNotification = (title, msg) => {
      setNotificationTitle('')
      setNotificationMessage(null)
    }

    if (loading || !loaded) {
      return <PageLoader />
    }

    return (
      <>
        <WrappedComponent {...props} />
        <Notification
          title={notificationTitle}
          message={notificationMessage}
          onCloseNotification={closeNotification}
        />
      </>
    )
  }

  return AuthComponent
}

export default withAuth
