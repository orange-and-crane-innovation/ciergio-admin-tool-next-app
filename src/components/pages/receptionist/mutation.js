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
