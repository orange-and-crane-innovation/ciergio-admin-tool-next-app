import { gql } from '@apollo/client'

const GET_ROLES = gql`
  query {
    getRoles {
      _id
      name
      permissions
    }
  }
`

const GET_ROLE = gql`
  query {
    role {
      _id
      name
      permissions
    }
  }
`

const GET_COMPANY_ROLES = gql`
  query getCompanyRoles($where: getCompanyRolesParams) {
    getCompanyRoles(where: $where) {
      _id
      companyId
      name
      status
      permissions {
        group
        accessLevel
      }
    }
  }
`

const UPDATE_COMPANY_ROLES = gql`
  mutation updateCompanyRole(
    $data: InputUpdateCompanyRole
    $companyRoleId: String
  ) {
    updateCompanyRole(data: $data, companyRoleId: $companyRoleId) {
      _id
      processId
      message
    }
  }
`

const DELETE_COMPANY_ROLES = gql`
  mutation deleteCompanyRole($companyRoleId: String) {
    deleteCompanyRole(companyRoleId: $companyRoleId) {
      _id
      processId
      message
    }
  }
`

const CREATE_COMPANY_ROLES = gql`
  mutation createCompanyRole(
    $data: InputCreateCompanyRole
    $companyId: String
  ) {
    createCompanyRole(data: $data, companyId: $companyId) {
      _id
      message
    }
  }
`

export {
  CREATE_COMPANY_ROLES,
  GET_ROLES,
  GET_ROLE,
  GET_COMPANY_ROLES,
  UPDATE_COMPANY_ROLES,
  DELETE_COMPANY_ROLES
}
