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

export const ADD_NOTE = gql`
  mutation createRegistryNote($data: CreateNoteInput) {
    createRegistryNote(data: $data) {
      message
    }
  }
`

export const UPDATE_RECORD = gql`
  mutation updateRegistryRecord($id: String, $data: CreateRecordInput) {
    updateRegistryRecord(id: $id, data: $data) {
      message
    }
  }
`
