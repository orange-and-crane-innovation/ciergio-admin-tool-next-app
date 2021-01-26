import gql from 'graphql-tag'

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
      post {
        _id
        title
        category {
          _id
          name
          updatedAt
          createdAt
        }
      }
    }
  }
`

export const GET_ALL_NOTIFICATIONS = gql`
  query getPublishedNotifications(
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
      post {
        _id
        title
        category {
          _id
          name
          updatedAt
          createdAt
        }
      }
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
      post {
        _id
        title
        category {
          _id
          name
          updatedAt
          createdAt
        }
      }
    }
  }
`

export const GET_ALL_TRASH_NOTIFICATIONS = gql`
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
      post {
        _id
        title
        category {
          _id
          name
          updatedAt
          createdAt
        }
      }
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
