export const toCurrency = (amount, noUnit) => {
  const fraction = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  })

  const noUnitFormat = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }

  if (noUnit) {
    return amount.toLocaleString('en-PH', noUnitFormat)
  }

  if (amount % 1 === 0) {
    return fraction.format(amount).replace(/^(\D+)/, '$1 ')
  } else {
    return formatter.format(amount).replace(/^(\D+)/, '$1 ')
  }
}
