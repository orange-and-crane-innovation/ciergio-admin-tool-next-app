/* eslint-disable react/display-name */
import Link from 'next/link'
import dayjs from '@app/utils/date'

import { ACCOUNT_TYPES } from '@app/constants'

const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE

export const SUPER_ADMIN = ACCOUNT_TYPES.SUP.value
export const COMPANY_ADMIN = ACCOUNT_TYPES.COMPYAD.value
export const COMPLEX_ADMIN = ACCOUNT_TYPES.COMPXAD.value
export const BUILDING_ADMIN = ACCOUNT_TYPES.BUIGAD.value
export const RECEPTIONIST = ACCOUNT_TYPES.RECEP.value
export const UNIT_OWNER = ACCOUNT_TYPES.UNIT.value
export const MEMBER = ACCOUNT_TYPES.MEM.value

export const columns = [
  {
    name: '',
    width: ''
  },
  {
    name: 'Name',
    width: ''
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
  }
]

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

export const ALL_ROLES = [
  SUPER_ADMIN,
  COMPLEX_ADMIN,
  COMPANY_ADMIN,
  BUILDING_ADMIN,
  RECEPTIONIST
]

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
