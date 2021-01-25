import gql from 'graphql-tag'

export const GET_ACCOUNTS = gql`
  query getAccounts(
    $companyId: String
    $accountTypes: [String]
    $search: String
  ) {
    getAccounts(
      where: {
        companyId: $companyId
        accountTypes: $accountTypes
        search: $search
        status: "active"
      }
    ) {
      count
      skip
      limit
      data {
        _id
        accountType
        user {
          firstName
          lastName
          avatar
          jobTitle
        }
        company {
          name
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

export const GET_COMPLEXES = gql`
  query getComplexesByCompanyId($id: String!) {
    getComplexes(where: { companyId: $id, status: "active" }) {
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
      data {
        _id
        name
      }
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
  mutation updateUser($data: InputUpdateUser, $id: String) {
    updateUser(data: $data, userId: $id) {
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`
