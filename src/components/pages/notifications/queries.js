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

export const GET_FLASH_NOTIFICATION = gql`
  query getFlashNotif($id: String) {
    getAllFlashNotifications(where: { _id: $id, limit: 1 }) {
      ${Pagev2}
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
export const BULK_UPDATE_MUTATION = gql`
  mutation bulkUpdatePost($id: [String], $status: postStatus) {
    bulkUpdatePost(id: $id, status: $status) {
      processId
      message
    }
  }
`
