import gql from 'graphql-tag'

export const GET_ACCOUNTS = gql`
  query getAccounts($where: GetAccountsParams, $skip: Int, $limit: Int) {
    getAccounts(where: $where, skip: $skip, limit: $limit) {
      count
      skip
      limit
      data {
        _id
        accountType
        companyRoleId
        companyRole {
          _id
          name
          status
          permissions {
            group
            accessLevel
          }
        }
        companyGroups {
          _id
          name
        }
        user {
          _id
          firstName
          lastName
          avatar
          jobTitle
          email
          birthDate
          gender
          createdAt
        }
        company {
          name
          _id
        }
        complex {
          name
          _id
        }
        building {
          name
          _id
        }
      }
    }
  }
`

export const GET_ACCOUNT = gql`
  query getAccount($id: String!) {
    getAccounts(where: { userId: $id }) {
      data {
        _id
        accountType
        user {
          _id
          firstName
          lastName
          avatar
          jobTitle
          email
          createdAt
        }
        company {
          name
          _id
        }
        complex {
          name
          _id
        }
        building {
          name
          _id
        }
        history(where: { accountId: $id }) {
          limit
          count
          data {
            date
            action
            data
          }
        }
      }
    }
  }
`

export const GET_COMPANIES = gql`
  {
    getCompanies(where: { status: "active" }) {
      data {
        _id
        name
      }
    }
  }
`
export const GET_COMPANY_ROLES = gql`
  query getCompanyRoles($id: String!, $status: String!) {
    getCompanyRoles(where: { companyId: $id, status: $status }) {
      _id
      name
    }
  }
`

export const GET_COMPLEXES = gql`
  query getComplexesByCompanyId($id: String!) {
    getComplexes(where: { companyId: $id, status: "active" }) {
      count
      data {
        _id
        name
      }
    }
  }
`

export const GET_BUILDINGS = gql`
  query getBuildingByComplexId($id: String!) {
    getBuildings(where: { complexId: $id, status: "active" }) {
      count
      data {
        _id
        name
      }
    }
  }
`

export const GET_BUILDING = gql`
  query getBuilding($id: String!) {
    getBuildings(where: { _id: $id, status: "active" }) {
      count
      data {
        _id
        name
      }
    }
  }
`

export const GET_PENDING_INVITES = gql`
  query getInvites(
    $where: GetPendingRegistrationParams
    $limit: Int
    $offset: Int
  ) {
    getPendingRegistration(where: $where, limit: $limit, skip: $offset) {
      limit
      count
      data {
        _id
        email
        createdAt
        accountType
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
        companyGroups {
          _id
          name
        }
      }
    }
  }
`
export const INVITE_STAFF = gql`
  mutation addStaff($data: InputAddStaff, $id: String) {
    addStaff(data: $data, companyId: $id) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const ADD_BUILDING_ADMIN = gql`
  mutation inviteBuildingAdmin(
    $data: InputAddBuildingAdministrator
    $id: String
  ) {
    addBuildingAdministrator(data: $data, buildingId: $id) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`
export const ADD_COMPANY_ADMIN = gql`
  mutation inviteCompanyAdmin(
    $data: InputAddCompanyAdministrator
    $id: String
  ) {
    addCompanyAdministrator(data: $data, companyId: $id) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const ADD_COMPLEX_ADMIN = gql`
  mutation inviteComplexAdmin(
    $data: InputAddComplexAdministrator
    $id: String
  ) {
    addComplexAdministrator(data: $data, complexId: $id) {
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const ADD_RECEPTIONIST = gql`
  mutation inviteReceptionist($data: InputAddReceptionist, $id: String) {
    addReceptionist(data: $data, buildingId: $id) {
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const ADD_UNIT_OWNER = gql`
  mutation inviteUnitOwner($data: InputAddUnitOwner) {
    addUnitOwner(data: $data, companyId: $id) {
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const UPDATE_USER = gql`
  mutation updateUser(
    $data: InputUpdateUser
    $companyRole: InputCompanyRole
    $id: String
  ) {
    updateUser(data: $data, companyRole: $companyRole, userId: $id) {
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const DELETE_USER = gql`
  mutation deleteUser($data: InputDeleteAccount) {
    deleteAccount(data: $data) {
      processId
      message
      slave
      vpc
      registrationCode
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

export const RESEND_INVITE = gql`
  mutation resendInvite($data: InputResendInvite) {
    resendInvite(data: $data) {
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const CANCEL_INVITE = gql`
  mutation cancelInvite($data: InputCancelRegistrationInvite) {
    cancelRegistrationInvite(data: $data) {
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const GET_ACCOUNT_LATEST_ACTIVITY = gql`
  query getLatestAccountActivity($accountId: String!) {
    getLatestAccountActivity(accountId: $accountId) {
      _id
      action
      activityDate
      deviceInfo {
        oSName
        oSVersion
        type
        brand
        model
      }
    }
  }
`
