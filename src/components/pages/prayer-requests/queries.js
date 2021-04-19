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

export const GET_PRAYER_REQUEST_DETAILS = gql`
  query getPrayerRequestDetails($id: String) {
    getIssue(id: $id) {
      issue {
        _id
        createdAt
        readAt
        title
        content
        status
        category {
          _id
          name
          __typename
        }
        code
        author {
          _id
          accountType
          user {
            _id
            firstName
            lastName
            __typename
          }
          __typename
        }
        reporter {
          _id
          accountType
          user {
            _id
            firstName
            lastName
            __typename
          }
          __typename
        }
        company {
          _id
          name
          __typename
        }
        complex {
          _id
          name
          __typename
        }
        prayer {
          for
          from
          date
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export const GET_PRAYER_REQUEST_HISTORY = gql`
  query getPrayerRequestHistory(
    $id: String
    $limit: Int
    $offset: Int
    $sort: Int
  ) {
    getIssue(id: $id) {
      issue {
        _id
        history(limit: $limit, offset: $offset, sort: $sort) {
          count
          data {
            _id
            by {
              accountType
              user {
                _id
                firstName
                lastName
                __typename
              }
              __typename
            }
            action
            activity
            createdAt
            __typename
          }
          __typename
        }
        __typename
      }
    }
  }
`

export const GET_NEW_PRAYER_REQUESTS = gql`
  query getNewPrayerRequests(
    $categoryId: String
    $complexId: String
    $search: String
    $limit: Int
    $offset: Int
  ) {
    getIssues(
      where: { categoryId: $categoryId, complexId: $complexId, status: [unread] }
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
    $categoryId: String
    $complexId: String
    $search: String
    $limit: Int
    $offset: Int
  ) {
    getIssues(
      where: {categoryId: $categoryId, complexId: $complexId, status: [read] }
      search: $search
      limit: $limit
      offset: $offset
    ) {
      ${Pagev2}
      ${PRAYER_REQUESTS_RESPONSE}
  }
`

export const GET_POST_CATEGORY = gql`
  {
    getPostCategory(where: { type: issue }, sort: { order: asc }) {
      count
      category {
        _id
        name
        __typename
      }
      __typename
    }
  }
`

export const GET_COMPLEXES = gql`
  query getComplexes($where: GetComplexesParams) {
    getComplexes(where: $where) {
      count
      limit
      skip
      data {
        _id
        name
      }
    }
  }
`

export const CREATE_PRAYER_REQUEST = gql`
  mutation createPrayerRequest($data: InputCreateIssue) {
    createIssue(data: $data) {
      _id
      message
      processId
      __typename
    }
  }
`

export const UPDATE_PRAYER_REQUEST = gql`
  mutation updatePrayerRequest($id: String, $data: InputUpdateIssue) {
    updateIssue(id: $id, data: $data) {
      _id
      message
      processId
      __typename
    }
  }
`
