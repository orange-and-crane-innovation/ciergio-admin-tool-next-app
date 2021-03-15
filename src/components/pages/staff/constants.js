/* eslint-disable react/display-name */
import Link from 'next/link'
import dayjs from '@app/utils/date'

export const BUILDING_ADMIN = 'building_admin'
export const COMPANY_ADMIN = 'company_admin'
export const COMPLEX_ADMIN = 'complex_admin'
export const RECEPTIONIST = 'receptionist'
export const UNIT_OWNER = 'unit_owner'

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
    label: 'Company Admin',
    value: COMPANY_ADMIN
  },
  {
    label: 'Complex Admin',
    value: COMPLEX_ADMIN
  },
  {
    label: 'Building Administrator',
    value: BUILDING_ADMIN
  },
  {
    label: 'Unit Owner',
    value: UNIT_OWNER
  },
  {
    label: 'Receptionist',
    value: RECEPTIONIST
  }
]

export const ALL_ROLES = [
  BUILDING_ADMIN,
  COMPANY_ADMIN,
  COMPLEX_ADMIN,
  RECEPTIONIST,
  UNIT_OWNER
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
      <Link href={`/dashboard/issues/view/${data?.issueId}` || ''}>ticket</Link>
      .
    </span>
  ),
  AssignIssue: data => (
    <span>
      {data?.authorName || ''} assigned a{' '}
      <Link href={`/dashboard/issues/view/${data?.issueId}` || ''}>ticket</Link>{' '}
      to {(data?.assigneeName && data?.assigneeName) || ''}.
    </span>
  ),
  OnholdIssue: data => (
    <span>
      {data?.authorName || ''} has placed a{' '}
      <Link href={`/dashboard/issues/view/${data?.issueId} ` || ''}>
        ticket
      </Link>{' '}
      on hold.
    </span>
  ),
  ResolveIssue: data => (
    <span>
      {data?.authorName || ''} resolved a{' '}
      <Link href={`/dashboard/issues/view/${data?.issueId}` || ''}>ticket</Link>
      .
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
