import gql from 'graphql-tag'

export const GET_COMPANIES = gql`
  query getCompanies($where: GetCompaniesParams) {
    getCompanies(where: $where, limit: 50, skip: 0) {
      data {
        _id
        name
      }
    }
  }
`

export const GET_COMPLEXES = gql`
  query getComplexes($where: GetComplexesParams) {
    getComplexes(where: $where, limit: 50, skip: 0) {
      data {
        _id
        name
      }
    }
  }
`

export const GET_BUILDINGS = gql`
  query getBuildings($where: GetBuildingsParams) {
    getBuildings(where: $where, limit: 50, skip: 0) {
      data {
        _id
        name
      }
    }
  }
`

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
        updatedAt
        readAt
        status
        category {
          _id
          name
        }
        assignee {
          _id
          accountType
          user {
            _id
            firstName
            lastName
            avatar
          }
        }
        reporter {
          _id
          accountType
          user {
            _id
            firstName
            lastName
          }
          unit {
            _id
            name
          }
        }
      }
    }
  }
`

export const GET_ISSUES_COUNT = gql`
  query getIssuesCount($where: IssuesInput) {
    getIssues(where: $where) {
      countStatus {
        all
        assigned
        ongoing
        onhold
        read
        reopen
        resolved
        unassigned
        unread
      }
    }
  }
`

export const GET_CATEGORIES = gql`
  query getCategories($where: AllowedPostCategoryInput) {
    getAllowedPostCategory(where: $where, limit: 500) {
      count
      limit
      offset
      data {
        _id
        accountId
        accountType
        categories {
          _id
          name
          status
          defaultImage
          type
        }
      }
    }
  }
`

export const GET_UNITS = gql`
  query getUnits($where: GetUnitsParams) {
    getUnits(where: $where) {
      count
      data {
        _id
        name
        floorNumber
      }
    }
  }
`

export const GET_STAFFS = gql`
  query getStaffs($where: GetRepairsAndMaintenanceStaffsParams) {
    getRepairsAndMaintenanceStaffs(where: $where) {
      data {
        _id
        accountType
        user {
          _id
          firstName
          lastName
        }
        complex {
          _id
        }
        building {
          _id
        }
      }
    }
  }
`

export const GET_RESIDENTS = gql`
  query getResidents($where: GetAccountsParams) {
    getAccounts(where: $where, limit: 100, skip: 0) {
      count
      skip
      limit
      data {
        _id
        accountType
        user {
          _id
          firstName
          lastName
        }
      }
    }
  }
`

export const CREATE_ISSUE = gql`
  mutation createTicket($data: InputCreateIssue) {
    createIssue(data: $data) {
      _id
      message
      processId
    }
  }
`

export const GET_ISSUE_DETAILS = gql`
  query getIssueDetails($id: String) {
    getIssue(id: $id) {
      issue {
        _id
        createdAt
        readAt
        is_follower
        title
        content
        status
        code
        category {
          _id
          name
        }
        mediaAttachments {
          _id
          url
          type
        }
        author {
          _id
          accountType
          user {
            _id
            firstName
            lastName
          }
        }
        reporter {
          _id
          accountType
          user {
            _id
            firstName
            lastName
          }
        }
        assignee {
          _id
          accountType
          user {
            _id
            avatar
            firstName
            lastName
          }
        }
        company {
          _id
          name
        }
        complex {
          _id
          name
        }
        building {
          _id
          name
        }
        unit {
          _id
          name
        }
      }
    }
  }
`

export const GET_ISSUE_COMMENTS = gql`
  query getIssueComments($id: String, $limit: Int, $offset: Int, $sort: Int) {
    getIssue(id: $id) {
      issue {
        _id
        comments(limit: $limit, offset: $offset, sort: $sort) {
          count
          limit
          offset
          data {
            _id
            comment
            mediaAttachments {
              _id
              url
              type
            }
            user {
              _id
              avatar
              firstName
              lastName
            }
            createdAt
          }
        }
      }
    }
  }
`

export const POST_ISSUE_COMMENT = gql`
  mutation postIssueComment($data: CommentInput) {
    comment(data: $data) {
      _id
      message
      processId
    }
  }
`

export const GET_ISSUE_HISTORY = gql`
  query getIssueHistory($id: String, $limit: Int, $offset: Int) {
    getIssue(id: $id) {
      issue {
        history(limit: $limit, offset: $offset) {
          count
          limit
          offset
          data {
            _id
            by {
              _id
              accountType
              user {
                _id
                firstName
                lastName
              }
            }
            action
            activity
            createdAt
          }
        }
      }
    }
  }
`

export const FOLLOW_ISSUE = gql`
  mutation followIssue($data: FollowInput) {
    follow(data: $data) {
      _id
      processId
      message
    }
  }
`

export const UPDATE_ISSUE = gql`
  mutation updateIssue($id: String, $data: InputUpdateIssue) {
    updateIssue(id: $id, data: $data) {
      _id
      processId
      message
    }
  }
`

export const GET_BUILDING = gql`
  query getBuilding($where: GetBuildingsParams) {
    getBuildings(where: $where) {
      data {
        _id
        name
      }
    }
  }
`
