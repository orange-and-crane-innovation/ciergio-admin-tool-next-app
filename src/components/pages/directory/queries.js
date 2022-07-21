import gql from 'graphql-tag'

export const GET_COMPANIES = gql`
  {
    getCompanies {
      count
      limit
      data {
        _id
        name
      }
    }
  }
`

export const GET_COMPANY = gql`
  query getCompany($companyId: String) {
    getCompanies(where: { _id: $companyId }) {
      data {
        name
        _id
      }
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

export const GET_COMPLEX = gql`
  query getComplex($id: String) {
    getComplexes(where: { _id: $id }) {
      data {
        _id
        name
        company {
          _id
        }
      }
    }
  }
`

export const GET_BUILDINGS = gql`
  query getBuildingsByComplexId($complexId: String) {
    getBuildings(where: { complexId: $complexId }) {
      data {
        _id
        name
      }
    }
  }
`

export const GET_CONTACT_CATEGORY = gql`
  query getCategoriesByComplexId(
    $complexId: String
    $companyId: String
    $limit: Int
    $offset: Int
  ) {
    getContactCategories(
      where: { complexId: $complexId, companyId: $companyId, type: directory }
      limit: $limit
      skip: $offset
    ) {
      count
      limit
      data {
        _id
        name
        order
      }
      __typename
    }
  }
`

export const GET_CONTACTS = gql`
  query getContactsByComplexId(
    $complexId: String
    $companyId: String
    $limit: Int
    $offset: Int
  ) {
    getContacts(
      where: { complexId: $complexId, companyId: $companyId }
      limit: $limit
      skip: $offset
    ) {
      count
      limit
      data {
        _id
        name
        logo
        email
        contactNumber
        building {
          name
        }
        address {
          formattedAddress
          city
        }
        category {
          _id
          name
          order
          __typename
        }
      }
      __typename
    }
  }
`

export const CREATE_CONTACT = gql`
  mutation createContact(
    $complexId: String!
    $companyId: String!
    $data: InputContact!
  ) {
    createContact(data: $data, complexId: $complexId, companyId: $companyId) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const EDIT_CONTACT = gql`
  mutation editContact($data: InputContact!, $contactId: String!) {
    updateContact(data: $data, contactId: $contactId) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const DELETE_CONTACT = gql`
  mutation deleteContact($contactId: String!) {
    deleteContact(contactId: $contactId) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const CREATE_CATEGORY = gql`
  mutation addCategory($data: InputContactCategory) {
    createContactCategory(data: $data) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const EDIT_CATEGORY = gql`
  mutation editCategory(
    $data: InputUpdateContactCategory
    $categoryId: String
  ) {
    updateContactCategory(data: $data, contactCategoryId: $categoryId) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation deleteCategory($categoryId: String) {
    deleteContactCategory(contactCategoryId: $categoryId) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
    }
  }
`
