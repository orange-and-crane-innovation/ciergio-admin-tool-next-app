import gql from 'graphql-tag'

export const GET_ISSUES_BY_STATUS = gql`
  query getIssuesByStatus(
    $where: IssuesInput
    $limit: Int
    $offset: Int
    $search: String
  ) {
    getIssues(where: $where, limit: $limit, offset: $offset, search: $search) {
      count
      limit
      offset
      issue {
        _id
        title
        content
        code
        createdAt
        readAt
        status
        category {
          _id
          name
          __typename
        }
        assignee {
          _id
          user {
            _id
            firstName
            lastName
            avatar
          }
          __typename
        }
        reporter {
          user {
            _id
            firstName
            lastName
            __typename
          }
          unit {
            _id
            name
            __typename
          }
          __typename
        }
        __typename
      }
    }
  }
`
