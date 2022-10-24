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
        type
        name
        author {
          _id
          user {
            _id
            firstName
            avatar
            lastName
          }
          companyRole {
            _id
            name
            status
            permissions {
              group
              accessLevel
            }
          }
          status
          accountType
          active
          unit {
            _id
            name
          }
        }
        participants(limit: 1) {
          data {
            _id
            user {
              _id
              firstName
              lastName
              avatar
            }
            companyRole {
              _id
              name
              status
              permissions {
                group
                accessLevel
              }
            }
            unit {
              _id
              name
            }
            accountType
          }
        }
        messages(limit: 1) {
          count
          limit
          data {
            _id
            author {
              user {
                _id
                firstName
                lastName
              }
              companyRole {
                _id
                name
                status
                permissions {
                  group
                  accessLevel
                }
              }
            }
            message
            attachments {
              type
              filename
              url
            }
            viewers {
              count
              data {
                _id
                user {
                  _id
                  firstName
                  lastName
                }
                companyRole {
                  _id
                  name
                  status
                  permissions {
                    group
                    accessLevel
                  }
                }
              }
            }
          }
        }
        status
        selected
        createdAt
        updatedAt
      }
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
        status
        createdAt
        attachments {
          type
          filename
          url
        }
        author {
          user {
            _id
            firstName
            lastName
            avatar
          }
          companyRole {
            _id
            name
            status
            permissions {
              group
              accessLevel
            }
          }
          accountType
          active
          status
        }
        conversation {
          name
          type
          _id
          messages {
            count
            data {
              _id
              createdAt
              message
            }
          }
          participants {
            count
            data {
              _id
              user {
                firstName
                lastName
              }
              companyRole {
                _id
                name
                status
                permissions {
                  group
                  accessLevel
                }
              }
            }
          }
        }
        viewers {
          count
          data {
            _id
            user {
              _id
              firstName
              lastName
              avatar
            }
          }
        }
      }
    }
  }
`

export const getAccounts = gql`
  query getAccounts($where: GetAccountsParams, $limit: Int) {
    getAccounts(where: $where, limit: $limit, skip: 0) {
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
        }
        companyRole {
          _id
          name
          status
          permissions {
            group
            accessLevel
          }
        }
        unit {
          _id
          name
        }
      }
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
    }
  }
`

export const seenMessage = gql`
  mutation seenMessage($messageId: String) {
    seenMessage(messageId: $messageId) {
      _id
      slave
      message
      processId
    }
  }
`

export const GET_UNREAD_MESSAGE_QUERY = gql`
  query($accountId: String) {
    getUnreadConversationCount(where: { accountId: $accountId })
  }
`

export const REMOVE_CONVERSATION_PARTICIPANT = gql`
  mutation removeConversationParticipant(
    $participantId: String
    $conversationId: String
  ) {
    removeConversationParticipant(
      participantId: $participantId
      conversationId: $conversationId
    ) {
      _id
      processId
      message
    }
  }
`
