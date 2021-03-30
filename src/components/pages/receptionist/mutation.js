import { gql } from '@apollo/client'

export const CREATE_REGISTRYRECORD = gql`
  mutation createRegistryRecord($data: CreateRecordInput, $note: String) {
    createRegistryRecord(data: $data, note: $note) {
      _id
      message
      __typename
    }
  }
`

export const CANCEL_RECORD = gql`
  mutation($data: CreateRecordInput, $id: String) {
    updateRegistryRecord(data: $data, id: $id) {
      message
      _id
    }
  }
`
