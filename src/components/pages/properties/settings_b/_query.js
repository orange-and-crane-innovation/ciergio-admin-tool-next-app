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

        bulletinBoard {
          displayName
        }
        myProperties {
          displayName
        }
        myStaff {
          displayName
        }
        myResidents {
          displayName
          enable
        }
        attactionsAndEvents {
          displayName
          enable
        }
        myMembers {
          displayName
          enable
        }

        messages {
          displayName
        }
        notifications {
          displayName
        }
        forms {
          displayName
        }
        directory {
          displayName
          enable
        }
        qrCode {
          displayName
          enable
        }
        contactPage {
          displayName
          enable
        }
        guestAndDelivery {
          displayName
          enable
        }
        maintenanceAndRepairs {
          displayName
          enable
        }
        myDues {
          displayName
          enable
        }
        communityBoard {
          displayName
          enable
        }
        settingsPage {
          displayName
          enable
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
        homePage {
          displayName
          enable
        }
        faqPage {
          displayName
          enable
        }
        pastoralWorks {
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
