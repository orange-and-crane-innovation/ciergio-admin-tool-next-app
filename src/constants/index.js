import ACCOUNT_TYPES from './accountTypes'
import HISTORY_MESSAGES from './historyMessages'
import IMAGES from './images'
import { Transactions } from '@app/components/pages/donations/Transactions'

const ACCESSLEVEL = {
  NONE: 'none',
  ADMINISTER: 'administer',
  EDIT: 'edit',
  VIEW: 'none'
}

const TRANSACTIONSTATUS = {
  ACCEPT: 'Paid',
  REQUESTING: 'Pending'
}

const PAYMENTMETHODS = {
  instapay: 'Instapay',
  pesonet: 'Pesonet',
  creditcard: 'Credit Card',
  gcash: 'GCash',
  easyPaymentLink: 'Easy Payment Link'
}
const APP_DOWNLOAD_LINK = {
  ANDROID: {
    Mary_The_Queen_Parish_San_Juan_City_Philippines_:
      'https://play.google.com/store/apps/details?id=com.orangeandcrane.mtq',
    Parish_of_the_Holy_Sacrifice_Quezon_City_Philippines_:
      'https://play.google.com/store/apps/details?id=com.orangeandcrane.upparish',
    Parish_of_the_Holy_Sacrifice:
      'https://play.google.com/store/apps/details?id=com.orangeandcrane.upparish',
    Military_Ordinariate_Philippines:
      'https://play.google.com/store/apps/details?id=com.orangeandcrane.mop',
    Military_Ordinariate_of_the_Philippines:
      'https://play.google.com/store/apps/details?id=com.orangeandcrane.mop',
    OCI_APP:
      'https://play.google.com/store/apps/details?id=com.orangeandcrane.ciergio.demo'
  },
  IOS: {
    Mary_The_Queen_Parish_San_Juan_City_Philippines_:
      'https://apps.apple.com/us/app/mtq/id1528648429',
    Parish_of_the_Holy_Sacrifice_Quezon_City_Philippines_:
      'https://apps.apple.com/us/app/up-parish/id1574116179',
    Parish_of_the_Holy_Sacrifice:
      'https://apps.apple.com/us/app/up-parish/id1574116179',
    Military_Ordinariate_Philippines:
      'https://apps.apple.com/ph/app/m-o-p/id1644794999',
    Military_Ordinariate_of_the_Philippines:
      'https://apps.apple.com/ph/app/m-o-p/id1644794999',
    OCI_APP: ''
  }
}

export {
  IMAGES,
  ACCOUNT_TYPES,
  HISTORY_MESSAGES,
  ACCESSLEVEL,
  TRANSACTIONSTATUS,
  PAYMENTMETHODS,
  APP_DOWNLOAD_LINK
}
