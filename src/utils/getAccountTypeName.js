import { ACCOUNT_TYPES } from '@app/constants'

const getAccountTypeName = data => {
  const accountTypeName =
    data === ACCOUNT_TYPES.SUP.value
      ? ACCOUNT_TYPES.SUP.name
      : data === ACCOUNT_TYPES.COMPYAD.value
      ? ACCOUNT_TYPES.COMPYAD.name
      : data === ACCOUNT_TYPES.COMPXAD.value
      ? ACCOUNT_TYPES.COMPXAD.name
      : data === ACCOUNT_TYPES.BUIGAD.value
      ? ACCOUNT_TYPES.BUIGAD.name
      : data === ACCOUNT_TYPES.RECEP.value
      ? ACCOUNT_TYPES.RECEP.name
      : data === ACCOUNT_TYPES.UNIT.value
      ? ACCOUNT_TYPES.UNIT.name
      : data === ACCOUNT_TYPES.MEM.value
      ? ACCOUNT_TYPES.MEM.name
      : 'Unknown User Type'

  return accountTypeName
}

export default getAccountTypeName
