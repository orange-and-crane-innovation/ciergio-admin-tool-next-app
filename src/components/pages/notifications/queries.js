import gql from 'graphql-tag'
import { Pagev2, NOTIFICATION_RESPONSE } from '@app/utils/schema-varibles'

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

export const GET_NOTIFICATION = gql`
  query getNotif($id: String!) {
    getAllFlashNotifications(where: { _id: $id }, limit: 1) {
      post {
        _id
        status
        title
        content
        primaryMedia {
          url
          type
        }
      }
    }
  }
`

export const GET_POST_CATEGORIES = gql`
  {
    getPostCategory(where: { type: flash }) {
      category {
        _id
        name
      }
    }
  }
`

export const GET_FLASH_NOTIFICATION = gql`
  query getFlashNotif($id: String) {
    getAllFlashNotifications(where: { _id: $id }, limit: 1) {
      ${Pagev2}
      post {
        _id
        status
        title
        content
        createdAt
        updatedAt
        publishedAt
        category {
          _id
          name
        }
        primaryMedia {
          url
          type
        }
        audienceType
        audienceExpanse {
          company {
            _id
          }
          complex {
            _id
          }
          building {
            _id
          }
        }
        audienceExceptions {
          company {
            _id
          }
          complex {
            _id
          }
          building {
            _id
          }
        }
        recurringSchedule {
          type
          properties {
            dayOfWeek
            date
          }
          end {
            date
            instance
          }
        }
      }
    }
  }
`

export const GET_POST_HISTORY = gql`
  query getPostHistory($id: String!) {
    getPostHistory(id: $id) {
      post {
        action
        data
        date
      }
    }
  }
`

export const GET_VIEW_HISTORY = gql`
  query getViews($id: String) {
    getPostViewsHistory(limit: 10, offset: 0, id: $id) {
      data {
        _id
        count {
          audience
          uniqViews
          allViews
        }
        user {
          _id
          firstName
          lastName
          avatar
          address {
            line1
            line2
          }
          email
        }
      }
    }
  }
`

export const BULK_UPDATE_MUTATION = gql`
  mutation bulkUpdatePost($id: [String], $status: postStatus) {
    bulkUpdatePost(id: $id, status: $status) {
      _id
      processId
      message
    }
  }
`

export const TRASH_NOTIFICATION = gql`
  mutation trashNotif($id: String!) {
    updatePost(id: $id, data: { status: trashed }) {
      _id
      processId
      message
    }
  }
`

export const DELETE_NOTIFICATION = gql`
  mutation trashNotif($id: String!) {
    updatePost(id: $id, data: { status: deleted }) {
      _id
      processId
      message
    }
  }
`

export const CREATE_POST_MUTATION = gql`
  mutation($data: PostInput) {
    createPost(data: $data) {
      _id
      processId
      message
    }
  }
`

export const UPDATE_POST_MUTATION = gql`
  mutation($id: String, $data: PostInput) {
    updatePost(id: $id, data: $data) {
      _id
      processId
      message
    }
  }
`
