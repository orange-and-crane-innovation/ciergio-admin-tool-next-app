import { gql } from '@apollo/client'

const getCompanySettings = gql`
  query CompanySettings($where: getCompanySettingsParams) {
    getCompanySettings(where: $where) {
      _id
      paymentSettings {
        paymentToggle
      }
      allowPublicPosts
      keepActivityLogs
      keepDeletedPosts
      subscriptionModules {
        bulletinBoard {
          displayName
        }
        messages {
          displayName
        }
        qrCode {
          displayName
        }
        notifications {
          displayName
        }
        directory {
          displayName
        }
        forms {
          displayName
        }
        contactPage {
          displayName
        }
        guestAndDelivery {
          displayName
        }
        maintenanceAndRepairs {
          displayName
        }
        myDues {
          displayName
        }
        communityBoard {
          displayName
        }
        prayerRequests {
          displayName
          enable
        }
        dailyReading {
          displayName
          enable
        }
        donations {
          displayName
          enable
        }
      }
    }
  }
`

const updateCompanySettings = gql`
  mutation updateCompanySettings(
    $data: InputUpdateCompanySettings
    $companyId: String
  ) {
    updateCompanySettings(data: $data, companyId: $companyId) {
      _id
      processId
      message
      slave
      vpc
      registrationCode
      companyLogo
    }
  }
`

const getComplexes = gql`
  query getComplexes($where: GetComplexesParams) {
    getComplexes(where: $where) {
      count
      limit
      skip
      data {
        _id
        name
        buildings {
          count
        }
      }
    }
  }
`

export { getCompanySettings, updateCompanySettings, getComplexes }
