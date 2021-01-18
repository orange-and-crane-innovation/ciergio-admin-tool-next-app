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

export const GET_COMPLEXES = gql`
  query getComplexes($companyId: String!) {
    getComplexes(where: { companyId: $companyId }) {
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

export const GET_BUILDINGS = gql`
  query getBuildings($companyId: String!, $complexId: String!) {
    getBuildings(where: { companyId: $companyId, complexId: $complexId }) {
      count
      limit
      data {
        _id
        name
      }
    }
  }
`

export const GET_CONTACT_CATEGORY = gql`
  {
    getContactCategories(where: { type: directory }) {
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
  query getContacts($categoryId: String, $buildingId: String) {
    getContacts(where: { categoryId: $categoryId, buildingId: $buildingId }) {
      count
      limit
      data {
        _id
        name
        logo
        building {
          name
        }
        address {
          formattedAddress
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
