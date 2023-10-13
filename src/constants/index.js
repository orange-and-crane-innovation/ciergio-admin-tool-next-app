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

export {
  IMAGES,
  ACCOUNT_TYPES,
  HISTORY_MESSAGES,
  ACCESSLEVEL,
  TRANSACTIONSTATUS,
  PAYMENTMETHODS
}
