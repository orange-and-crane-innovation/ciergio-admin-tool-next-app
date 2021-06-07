import gql from 'graphql-tag'

export const GET_RESIDENTS = gql`
  query getResident($where: GetAccountsParams, $limit: Int, $skip: Int) {
    getAccounts(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        accountType
        user {
          _id
          firstName
          lastName
          avatar
          email
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

export const GET_RESIDENT_HISTORY = gql`
  query getResidentHistory($where: GetHistoryParams, $limit: Int, $skip: Int) {
    getAccountHistory(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        date
        action
        data
      }
    }
  }
`

export const GET_FLOOR_NUMBERS = gql`
  query getFloorNumbers($buildingId: String) {
    getFloorNumbers(buildingId: $buildingId)
  }
`

export const GET_INVITES_AND_REQUESTS = gql`
  query ($where: GetExtensionAccountRequestsParams, $limit: Int, $skip: Int) {
    getExtensionAccountRequests(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id

        firstName
        lastName
        email
        createdAt
        accountType
        unit {
          _id
          name
        }
      }
    }
  }
`

export const RESEND_INVITE = gql`
  mutation resendInvite($data: InputResendInvite) {
    resendInvite(data: $data) {
      _id
      message
      processId
    }
  }
`

export const CANCEL_INVITE = gql`
  mutation cancelInvite($data: InputCancelExtensionAccount) {
    cancelExtensionAccount(data: $data) {
      _id
      message
      processId
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

export const INVITE_RESIDENT = gql`
  mutation inviteResident(
    $data: InputRequestExtensionAccount
    $unitId: String
  ) {
    requestExtensionAccount(data: $data, unitId: $unitId) {
      _id
      message
      processId
    }
  }
`

export const GET_BUILDINGS_QUERY = gql`
  query getBuildings($where: GetBuildingsParams, $limit: Int, $skip: Int) {
    getBuildings(where: $where, limit: $limit, skip: $skip) {
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
