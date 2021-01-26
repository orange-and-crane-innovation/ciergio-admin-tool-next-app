import gql from 'graphql-tag'

const NOTIFICATION_RESPONSE = `
  offset
  limit
  count
  post {
    _id
    title
    publishedAt
    publishedNextAt
    createdAt
    updatedAt
    category {
      _id
      name
    }
  }
`

export const GET_ALL_UPCOMING_NOTIFICATIONS = gql`
  query getUpcomingNotifications(
    $limit: Int
    $offset: Int
    $search: String
    $categoryId: String
  ) {
    getAllFlashNotifications(
      where: { status: [upcoming], search: $search, categoryId: $categoryId }
      limit: $limit
      offset: $offset
    ) {
      ${NOTIFICATION_RESPONSE}
    }
  }
`

export const GET_ALL_PUBLISHED_NOTIFICATIONS = gql`
  query getPublishedNotifications(
    $limit: Int
    $offset: Int
    $search: String
    $categoryId: String
  ) {
    getAllFlashNotifications(
      where: { status: [published], search: $search, categoryId: $categoryId }
      limit: $limit
      offset: $offset
    ) {
      ${NOTIFICATION_RESPONSE}
    }
  }
`

export const GET_ALL_DRAFT_NOTIFICATIONS = gql`
  query getDraftNotifications(
    $limit: Int
    $offset: Int
    $search: String
    $categoryId: String
  ) {
    getAllFlashNotifications(
      where: { status: [draft], search: $search, categoryId: $categoryId }
      limit: $limit
      offset: $offset
    ) {
      ${NOTIFICATION_RESPONSE}
    }
  }
`

export const GET_ALL_TRASHED_NOTIFICATIONS = gql`
  query getTrashedNotifications(
    $limit: Int
    $offset: Int
    $search: String
    $categoryId: String
  ) {
    getAllFlashNotifications(
      where: { status: [trashed], search: $search, categoryId: $categoryId }
      limit: $limit
      offset: $offset
    ) {
      ${NOTIFICATION_RESPONSE}
    }
  }
`

export const GET_FLASH_NOTIFICATION = gql`
  query getFlashNotif($id: String) {
    getAllFlashNotifications(where: { _id: $id, limit: 1 }) {
      count
      limit
      offset
      post {
        _id
        status
        content
        primaryMedia {
          url
          type
          __typename
        }
      }
    }
  }
`
