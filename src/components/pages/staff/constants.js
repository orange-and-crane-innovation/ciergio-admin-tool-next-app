/* eslint-disable react/display-name */
import Link from 'next/link'
import dayjs from '@app/utils/date'

const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE

export const BUILDING_ADMIN = 'building_admin'
export const COMPANY_ADMIN = 'company_admin'
export const COMPLEX_ADMIN = 'complex_admin'
export const RECEPTIONIST = 'receptionist'
export const UNIT_OWNER = 'unit_owner'
export const MEMBER = 'member'
export const SUPER_ADMIN = 'administrator'

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

export const roles = [
  {
    label: 'Super User',
    value: SUPER_ADMIN
  },
  {
    label: 'Company Admin',
    value: COMPANY_ADMIN
  },
  {
    label: 'Complex Admin',
    value: COMPLEX_ADMIN
  }
]

export const prayStaffRoles = [
  {
    label: 'Parish Head',
    value: 'company_admin'
  },
  {
    label: 'Parish Admin',
    value: 'complex_admin'
  }
]

export const ROLES = systemType === 'pray' ? prayStaffRoles : roles
export const STAFF_ROLES = [
  {
    label: 'Super User',
    value: 'administrator'
  },
  ...ROLES
]

export const ALL_ROLES = [SUPER_ADMIN, COMPLEX_ADMIN, COMPANY_ADMIN, MEMBER]

export const parseAccountType = type => {
  const system = systemType?.toLowerCase()
  if (system === 'pray') {
    switch (type) {
      case 'company_admin':
        return 'Parish Head'
      case 'complex_admin':
        return 'Parish Admin'
      case 'administrator':
        return 'Super Admin'
      default:
        return type
    }
  } else {
    return type.replace('_', ' ')
  }
}

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
