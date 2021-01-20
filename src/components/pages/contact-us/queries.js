import gql from 'graphql-tag'

export const GET_CONTACTS = gql`
  {
    getContacts(where: { type: contactus }) {
      count
      limit
      data {
        _id
        name
        email
        description
      }
      __typename
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
