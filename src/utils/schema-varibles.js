/* eslint-disable one-var */
export const MutationResponse = `
    {
      _id
      slave
      message
      processId
    }
`,
  MutationResponse2 = `
    {
      _id
      message
      processId
    }
`,
  Page = `
    count
    limit
    skip
`,
  Pagev2 = `
    count
    limit
    offset
`,
  Pagev3 = `
    count {
      all
      unread
      unassigned
      assigned
      ongoing
      onhold
      resolved
    }
    offset
    limit
`,
  User = `
    _id
    email
    status
    firstName
    lastName
    birthDate
    contactNo
    jobTitle
    avatar
    coverPhoto
    createdAt
    updatedAt
    address {
      line1
      line2
      city
      province
      zipCode
      country
    }
`,
  Org = `
    _id
    name
    status
    avatar
    coverPhoto
    createdAt
    updatedAt
    address {
      formattedAddress
      city
    }
`,
  Administrator = `
    ${Page}
    data {
      _id
      user {
        ${User}
      }
    }
`,
  Reservee = `
    reservee {
      _id
      email
    }
`,
  UnitType = `
    unitType {
      _id
      name
      sizes
      buildingId
      status
      createdAt
      updatedAt
    }
`,
  Unit = `
    _id
    name
    status
    profileColor
    floorNumber
    floorName
    unitSize
    createdAt
    updatedAt
`,
  Building = `
    ${Org}
    buildingAdministrators (limit: 1) {
      ${Administrator}
    }
`,
  Buildings = `
    ${Page}
    data {
      ${Org}
      buildingAdministrators (limit: 1)  {
        ${Administrator}
      }
    }
`,
  Complex = `
    ${Org}
    complexAdministrators (limit: 1)  {
      ${Administrator}
    }
    company {
      ${Org}
    }
    buildings {
      ${Buildings}
    }
`,
  Complexes = `
    ${Page}
    data {
      ${Org}
      complexAdministrators (limit: 1)  {
        ${Administrator}
      }
    }
`,
  Company = `
    ${Org}
    email
    tinNumber
    contactNumber
    buildingLimit
    complexLimit
    complexes {
      ${Complexes}
    }
    buildings {
      ${Buildings}
    }
    companyAdministrators (limit: 1)  {
      ${Administrator}
    }
`,
  UserAccount = `
    _id
    active
    accountType
    user {
      ${User}
    }
    company {
      ${Company}
      sentExtensionAccountRequests {
        count
      }
      receivedExtensionAccountRequests {
        count
      }
      pendingExtensionAccountRequests {
        count
      }
    }
    complex {
      ${Complex}
      sentExtensionAccountRequests {
        count
      }
      receivedExtensionAccountRequests {
        count
      }
      pendingExtensionAccountRequests {
        count
      }
    }
    building {
      ${Building}
      sentExtensionAccountRequests {
        count
      }
      receivedExtensionAccountRequests {
        count
      }
      pendingExtensionAccountRequests {
        count
      }
    }
    unit {
      ${Unit}
    }
`,
  // conversations {
  //   count
  //   limit
  //   skip
  //   data{
  //     _id
  //     name
  //     messages (limit: 1) {
  //       count
  //       limit
  //       skip
  //       data {
  //         _id
  //         message
  //         viewers {
  //           count
  //           data {
  //             _id
  //           }
  //         }
  //         author {
  //           _id
  //         }
  //       }
  //     }
  //   }
  // }
  // conversations {
  //   ${Conversations}
  // }
  Post = `
    _id
    title
    content
    status
    createdAt
    updatedAt
    publishedAt
    primaryMedia {
      url
      type
    }
    embeddedMediaFiles { 
      _id
      url 
      platform
      type
    }
`,
  PostViews = `
    ${Pagev2}
    unique {
      count
      users {
        ${User}
      }
    }
`,
  PostCats = `
    category {
      _id
      name
      status
    }
    subcategory {
      _id
      name
      status
    }
`,
  PostAudience = `
    company {
      _id
    }
    complex {
      _id
    }
    building {
      _id
    }
`,
  MessageViewer = `
    ${Page}
    data {
      _id
      accountType
      active
      user {
        ${User}
      }
    }
`,
  Participants = `
    ${Page}
    data {
      ${UserAccount}
    }
`,
  Message = `
    _id
    message
    status
    createdAt
    updatedAt
    attachments {
      type
      filename
      url
    }
    conversation {
      _id
      name
      type
    }
    author {
      _id
      active
      accountType
      user {
        ${User}
      }
    }
    viewers {
      ${MessageViewer}
    }
`,
  Messages = `
    ${Page}
    data {
      ${Message}
    }
`,
  Conversations = `
    ${Page}
    data {
      _id
      name
      type
      status
      selected
      createdAt
      updatedAt
      participants {
        ${Participants}
      }
      messages(limit: 1) {
        ${Messages}
      }
    }
`,
  Issue = `
    _id
    code
    status
    onHold
    notes
    content
    updatedAt

    category {
      _id
      name
    }
    author {
      ${UserAccount}
    }
    assignee {
      ${UserAccount}
    }
    company {
      ${Company}
    }
    complex {
      ${Complex}
    }
    building {
      ${Building}
    }
    unit {
      ${Unit}
    }
`,
  ExtensionAccount = `
    _id
    firstName
    lastName
    status
    email
    note
    relationship
    updatedAt

    from {
      ${UserAccount}
    }
    account {
      ${UserAccount}
      conversations {
        ${Conversations}
      }
    }
    unit {
      ${Unit}
      ${Reservee}
      unitOwner {
        ${UserAccount}
      }
    }
`,
  ExtensionAccountRequests = `
    ${Page}
    data {
      ${ExtensionAccount}
    }
`,
  NOTIFICATION_RESPONSE = `
  ${Pagev2}
  post {
    _id
    title
    publishedAt
    publishedNextAt
    createdAt
    updatedAt
    category {
      _id
      name
    }
  }
`,
  PRAYER_REQUESTS_RESPONSE = `
  issue {
    _id
    content
    assignee {
      _id
      accountType
      user {
        avatar
        firstName
        lastName
        __typename
      }
      __typename
    }
    author {
      _id
      user {
        firstName
        lastName
        __typename
      }
      __typename
    }
    category {
      name
      __typename
    }
    prayer {
      from
      for
      date
      __typename
    }
    reporter {
      _id
      user {
        firstName
        lastName
        __typename
      }
      __typename
    }
    building {
      _id
      name
      __typename
    }
    unit {
      _id
      name
      __typename
    }
    readAt
    status
    updatedAt
    createdAt
    __typename
  }
  __typename
}
  `
