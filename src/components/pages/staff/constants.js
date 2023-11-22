/* eslint-disable react/display-name */
import Link from 'next/link'
import dayjs from '@app/utils/date'

import { ACCOUNT_TYPES } from '@app/constants'

const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
const isBrowser = typeof window !== 'undefined'
const profile = isBrowser && JSON.parse(localStorage.getItem('profile'))
const accountType = profile?.accounts?.data[0]?.accountType

export const SUPER_ADMIN = ACCOUNT_TYPES.SUP.value
export const COMPANY_ADMIN = ACCOUNT_TYPES.COMPYAD.value
export const COMPLEX_ADMIN = ACCOUNT_TYPES.COMPXAD.value
export const BUILDING_ADMIN = ACCOUNT_TYPES.BUIGAD.value
export const RECEPTIONIST = ACCOUNT_TYPES.RECEP.value
export const UNIT_OWNER = ACCOUNT_TYPES.UNIT.value
export const MEMBER = ACCOUNT_TYPES.MEM.value

export const columns = [
  {
    name: 'Name',
    width: ''
  },
  {
    name: 'Email',
    width: '',
    hidden: true
  },
  {
    name: 'Role',
    width: ''
  },
  {
    name: 'Assignment',
    width: ''
  },
  {
    name: '',
    width: ''
  }
]

const roles = [
  {
    label: ACCOUNT_TYPES.SUP.name,
    value: SUPER_ADMIN
  },
  {
    label: ACCOUNT_TYPES.COMPYAD.name,
    value: COMPANY_ADMIN
  },
  {
    label: ACCOUNT_TYPES.COMPXAD.name,
    value: COMPLEX_ADMIN
  },
  {
    label: ACCOUNT_TYPES.BUIGAD.name,
    value: BUILDING_ADMIN
  },
  {
    label: ACCOUNT_TYPES.RECEP.name,
    value: RECEPTIONIST
  }
]

const companyRoles = [
  {
    label: ACCOUNT_TYPES.COMPYAD.name,
    value: COMPANY_ADMIN
  },
  {
    label: ACCOUNT_TYPES.COMPXAD.name,
    value: COMPLEX_ADMIN
  },
  {
    label: ACCOUNT_TYPES.BUIGAD.name,
    value: BUILDING_ADMIN
  },
  {
    label: ACCOUNT_TYPES.RECEP.name,
    value: RECEPTIONIST
  }
]

const complexRoles = [
  {
    label: ACCOUNT_TYPES.COMPXAD.name,
    value: COMPLEX_ADMIN
  },
  {
    label: ACCOUNT_TYPES.BUIGAD.name,
    value: BUILDING_ADMIN
  },
  {
    label: ACCOUNT_TYPES.RECEP.name,
    value: RECEPTIONIST
  }
]

const buildingRoles = [
  {
    label: ACCOUNT_TYPES.BUIGAD.name,
    value: BUILDING_ADMIN
  },
  {
    label: ACCOUNT_TYPES.RECEP.name,
    value: RECEPTIONIST
  }
]

const prayStaffRoles = [
  {
    label: ACCOUNT_TYPES.SUP.name,
    value: SUPER_ADMIN
  },
  {
    label: ACCOUNT_TYPES.PARISHADMIN.name,
    value: COMPANY_ADMIN
  },
  {
    label: ACCOUNT_TYPES.PARISHHEAD.name,
    value: COMPLEX_ADMIN
  }
]

const circleStaffRoles = [
  {
    label: ACCOUNT_TYPES.SUP.name,
    value: SUPER_ADMIN
  },
  {
    label: ACCOUNT_TYPES.COMPYAD.name,
    value: COMPANY_ADMIN
  },
  {
    label: ACCOUNT_TYPES.COMPXAD.name,
    value: COMPLEX_ADMIN
  }
]

export let STAFF_ROLES = roles
export let CREATE_STAFF_ROLES = [
  {
    label: ACCOUNT_TYPES.COMPYAD.name,
    value: COMPANY_ADMIN
  },
  {
    label: ACCOUNT_TYPES.COMPXAD.name,
    value: COMPLEX_ADMIN
  },
  {
    label: ACCOUNT_TYPES.BUIGAD.name,
    value: BUILDING_ADMIN
  },
  {
    label: ACCOUNT_TYPES.RECEP.name,
    value: RECEPTIONIST
  }
]

export const COMPANY_STAFF_ROLES = [
  {
    label: ACCOUNT_TYPES.COMPXAD.name,
    value: COMPLEX_ADMIN
  },
  {
    label: ACCOUNT_TYPES.BUIGAD.name,
    value: BUILDING_ADMIN
  },
  {
    label: ACCOUNT_TYPES.RECEP.name,
    value: RECEPTIONIST
  }
]

export const COMPLEX_STAFF_ROLES = [
  {
    label: ACCOUNT_TYPES.BUIGAD.name,
    value: BUILDING_ADMIN
  },
  {
    label: ACCOUNT_TYPES.RECEP.name,
    value: RECEPTIONIST
  }
]

export const BUILDING_STAFF_ROLES = [
  {
    label: ACCOUNT_TYPES.RECEP.name,
    value: RECEPTIONIST
  }
]

if (accountType === COMPANY_ADMIN) {
  STAFF_ROLES = companyRoles
  CREATE_STAFF_ROLES = COMPANY_STAFF_ROLES
} else if (accountType === COMPLEX_ADMIN) {
  STAFF_ROLES = complexRoles
  CREATE_STAFF_ROLES = COMPLEX_STAFF_ROLES
} else if (accountType === BUILDING_ADMIN) {
  STAFF_ROLES = buildingRoles
  CREATE_STAFF_ROLES = BUILDING_STAFF_ROLES
}

if (systemType === 'pray') {
  STAFF_ROLES = prayStaffRoles
  CREATE_STAFF_ROLES = [
    {
      label: ACCOUNT_TYPES.PARISHADMIN.name,
      value: COMPANY_ADMIN
    },
    {
      label: ACCOUNT_TYPES.PARISHHEAD.name,
      value: COMPLEX_ADMIN
    }
  ]
}

if (systemType === 'circle') {
  STAFF_ROLES = circleStaffRoles
  CREATE_STAFF_ROLES = [
    {
      label: ACCOUNT_TYPES.COMPYAD.name,
      value: COMPANY_ADMIN
    },
    {
      label: ACCOUNT_TYPES.COMPXAD.name,
      value: COMPLEX_ADMIN
    }
  ]
}

export const ALL_ROLES = [
  SUPER_ADMIN,
  COMPANY_ADMIN,
  COMPLEX_ADMIN,
  BUILDING_ADMIN,
  RECEPTIONIST
]

export const COMPANY_ROLES = [
  COMPANY_ADMIN,
  COMPLEX_ADMIN,
  BUILDING_ADMIN,
  RECEPTIONIST
]

export const COMPLEX_ROLES = [COMPLEX_ADMIN, BUILDING_ADMIN, RECEPTIONIST]

export const BUILDING_ROLES = [BUILDING_ADMIN, RECEPTIONIST]

const historyMessages = {
  CreateUnitType: data =>
    `${data?.userFullName || ''} created an unit type: ${
      data?.unitTypeName || ''
    }`,
  CreateComplex: data => (
    <span>
      {data?.userFullName || ''} added a new complex: {data?.complexName || ''}.
    </span>
  ),
  CreateBuilding: data =>
    `${data?.userFullName || ''} added a new building in ${
      data?.complexName || ''
    }: ${data?.buildingName || ''}.`,

  CreateUnit: data =>
    `${data?.userFullName || ''} added a new unit: ${data?.unitName || ''}.`,
  JoinUnit: data => (
    <span>
      {data?.userFUllName || ''} joined {data?.unitName} as {data?.role}.
    </span>
  ),

  CreateIssue: data => (
    <span>
      {data?.authorName || ''} submitted a{' '}
      <Link href={`/maintenance/details/${data?.issueId}` || ''}>ticket</Link>.
    </span>
  ),
  AssignIssue: data => (
    <span>
      {data?.authorName || ''} assigned a{' '}
      <Link href={`/maintenance/details/${data?.issueId}` || ''}>ticket</Link>{' '}
      to {(data?.assigneeName && data?.assigneeName) || ''}.
    </span>
  ),
  OnholdIssue: data => (
    <span>
      {data?.authorName || ''} has placed a{' '}
      <Link href={`/maintenance/details/${data?.issueId} ` || ''}>ticket</Link>{' '}
      on hold.
    </span>
  ),
  ResolveIssue: data => (
    <span>
      {data?.authorName || ''} resolved a{' '}
      <Link href={`/maintenance/details/${data?.issueId}` || ''}>ticket</Link>.
    </span>
  ),
  ViewBill: data => (
    <span>
      {data?.authorName || ''} has seen{' '}
      {dayjs(
        {
          month: (data?.period && data?.period.month - 1) || 0,
          year: data?.period && data?.period.year
        },
        'MMM YYYY'
      )}{' '}
      {data?.categoryName || ''} bill.
    </span>
  ),

  CreatePublishedPost: data => (
    <span>
      {data?.authorName || ''} published a {data?.type || 'post'}:{' '}
      {data?.title || 'post title'}.
    </span>
  )
}

export default historyMessages
