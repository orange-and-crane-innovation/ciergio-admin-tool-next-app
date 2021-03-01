import gql from 'graphql-tag'

export const getConversations = gql`
  query getConversations(
    $where: GetConversationsParams
    $limit: Int
    $skip: Int
  ) {
    getConversations(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        author {
          _id
          user {
            _id
            firstName
            avatar
            lastName
            __typename
          }
          status
          accountType
          active
          unit {
            _id
            name
            __typename
          }
          __typename
        }
        messages {
          count
          limit
          data {
            _id
            author {
              user {
                firstName
                lastName
                __typename
              }
              __typename
            }
            message
            attachments {
              type
              filename
              url
              __typename
            }
            viewers {
              count
              data {
                _id
                user {
                  _id
                  firstName
                  lastName
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        status
        selected
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`

export const getMessages = gql`
  query getMessages($where: GetMessagesParams, $limit: Int, $skip: Int) {
    getMessages(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        message
        author {
          user {
            _id
            firstName
            lastName
            avatar
            __typename
          }
          accountType
          active
          status
          __typename
        }
        conversation {
          _id
          messages {
            count
            data {
              _id
              message
              __typename
            }
            __typename
          }
          participants {
            count
            data {
              _id
              user {
                firstName
                lastName
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        viewers {
          data {
            _id
            user {
              _id
              firstName
              lastName
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export const getAccounts = gql`
  query getAccounts($where: GetAccountsParams, $limit: Int, $skip: Int) {
    getAccounts(where: $where, limit: $limit, skip: $skip) {
      data {
        _id
        active
        accountType
        user {
          _id
          email
          status
          firstName
          lastName
          avatar
          __typename
        }
        unit {
          _id
          name
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export const createConversation = gql`
  mutation createConversation($data: InputCreateConversation) {
    createConversation(data: $data) {
      _id
      slave
      message
      processId
      __typename
    }
  }
`

export const updateConversation = gql`
  mutation updateConversations($convoId: String) {
    updateSelectedConversation(conversationId: $convoId) {
      _id
      slave
      message
      processId
      __typename
    }
  }
`

export const sendMessage = gql`
  mutation sendMessage($data: InputCreateMessage, $convoId: String) {
    createMessage(data: $data, conversationId: $convoId) {
      _id
      slave
      message
      processId
      __typename
    }
  }
`
