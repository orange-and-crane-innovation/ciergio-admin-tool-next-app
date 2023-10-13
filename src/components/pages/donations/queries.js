import gql from 'graphql-tag'

export const GET_TRANSACTIONS = gql`
  query getDonationsWeb(
    $date: PaymentDateFilterInput
    $companyId: String
    $complexId: String
    $paymentMethod: PaymentMethod
    $campaignId: String
    $search: String
    $limit: Int
    $sort: Int
    $offset: Int
    $sortBy: String
    $orderType: String
  ) {
    getDonationsWeb(
      where: {
        srcRef: { companyId: $companyId, complexId: $complexId }
        date: $date
        method: $paymentMethod
        campaignId: $campaignId
        orderType: $orderType
      }
      search: $search
      limit: $limit
      offset: $offset
      sort: $sort
      sortBy: $sortBy
    ) {
      limit
      offset
      overallTotal
      overallTotalNet
      overallCount
      campaign {
        _id
        title
        primaryMedia {
          url
        }
      }

      data {
        _id
        method
        type
        name
        email
        amount
        bankCharges
        ociFee
        netAmount
        senderReferenceCode
        reconciliationId
        transactionId
        gatewayTransactionId
        paymentLink
        srcReference {
          company {
            id
            _id
            name
          }
        }
        campaign {
          _id
          title
          content
          category {
            _id
            name
          }
          subcategory {
            _id
            name
          }
        }
        status
        createdAt
        updatedAt
      }
    }
  }
`

export const GET_DONATIONS = gql`
  query getDonationsWeb(
    $date: PaymentDateFilterInput
    $companyId: String
    $complexId: String
    $paymentMethod: PaymentMethod
    $search: String
    $campaignId: String
    $limit: Int
    $sort: Int
    $offset: Int
  ) {
    getDonationsWeb(
      where: {
        srcRef: { companyId: $companyId, complexId: $complexId }
        date: $date
        method: $paymentMethod
        campaignId: $campaignId
      }
      search: $search
      limit: $limit
      offset: $offset
      sort: $sort
    ) {
      limit
      offset
      overallTotal
      overallTotalNet
      overallCount
      campaign {
        _id
        title
      }
      data {
        count
        total
        totalnet
        date {
          month
          day
          year
        }
        data {
          email
          name
          type
          amount
          bankCharges
          ociFee
          netAmount
          senderReferenceCode
          reconciliationId
          transactionId
          gatewayTransactionId
          campaign {
            _id
            title
            primaryMedia {
              url
            }
          }
          srcReference {
            company {
              name
            }
            complex {
              name
            }
          }
          status
          createdAt
          updatedAt
        }
      }
    }
  }
`

export const GET_PAYMENT_METHODS = gql`
  query {
    getPaymentMethods {
      count
      data {
        label
        value
      }
    }
  }
`
