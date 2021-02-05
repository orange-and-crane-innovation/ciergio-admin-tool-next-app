import { Pagev2, PRAYER_REQUESTS_RESPONSE } from '@app/utils/schema-varibles'
import gql from 'graphql-tag'

export const GET_PRAYER_REQUESTS = gql`
  query getNewPrayerRequests($complexId: String) {
    getIssues(where: { complexId: $complexId, status: [read, unread] }) {
      countStatus {
        unread
        read
        __typename
      }
      __typename
    }
  }
`

export const GET_NEW_PRAYER_REQUESTS = gql`
  query getNewPrayerRequests(
    $complexId: String
    $search: String
    $limit: Int
    $offset: Int
  ) {
    getIssues(
      where: { complexId: $complexId, status: [unread] }
      search: $search
      limit: $limit
      offset: $offset
    ) {
      ${Pagev2}
      ${PRAYER_REQUESTS_RESPONSE}
  }
`

export const GET_RECEIVED_PRAYER_REQUESTS = gql`
  query getReceivedPrayerRequests(
    $complexId: String
    $search: String
    $limit: Int
    $offset: Int
  ) {
    getIssues(
      where: { complexId: $complexId, status: [read] }
      search: $search
      limit: $limit
      offset: $offset
    ) {
      ${Pagev2}
      ${PRAYER_REQUESTS_RESPONSE}
  }
`
