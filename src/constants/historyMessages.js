/* eslint-disable react/display-name */
import React from 'react'
import Link from 'next/link'
import moment from 'moment'

const historyMessages = {
  CreateUnitType: data =>
    `${(data && data.userFullName) || ''} created an unit type: ${
      (data && data.unitTypeName) || ''
    }`,
  CreateComplex: data => (
    <span>
      {(data && data.userFullName) || ''} added a new complex:{' '}
      {(data && data.complexName) || ''}.
    </span>
  ),
  CreateBuilding: data =>
    `${(data && data.userFullName) || ''} added a new building in ${
      (data && data.complexName) || ''
    }: ${(data && data.buildingName) || ''}.`,

  CreateUnit: data =>
    `${(data && data.userFullName) || ''} added a new unit: ${
      (data && data.unitName) || ''
    }.`,
  JoinUnit: data => (
    <span>
      {(data && data.userFUllName) || ''} joined {data && data.unitName} as{' '}
      {data && data.role}.
    </span>
  ),

  CreateIssue: data => (
    <span>
      {(data && data.authorName) || ''} submitted a{' '}
      <Link href={`/dashboard/issues/view/${data && data.issueId}` || ''}>
        ticket
      </Link>
      .
    </span>
  ),
  AssignIssue: data => (
    <span>
      {(data && data.authorName) || ''} assigned a{' '}
      <Link href={`/dashboard/issues/view/${data && data.issueId}` || ''}>
        ticket
      </Link>{' '}
      to {(data && data.assigneeName && data.assigneeName) || ''}.
    </span>
  ),
  OnholdIssue: data => (
    <span>
      {(data && data.authorName) || ''} has placed a{' '}
      <Link href={`/dashboard/issues/view/${data && data.issueId} ` || ''}>
        ticket
      </Link>{' '}
      on hold.
    </span>
  ),
  ResolveIssue: data => (
    <span>
      {(data && data.authorName) || ''} resolved a{' '}
      <Link href={`/dashboard/issues/view/${data && data.issueId}` || ''}>
        ticket
      </Link>
      .
    </span>
  ),
  ViewBill: data => (
    <span>
      {(data && data.authorName) || ''} has seen{' '}
      {moment({
        month: (data && data.period && data.period.month - 1) || 0,
        year: data && data.period && data.period.year
      }).format('MMM YYYY')}{' '}
      {(data && data.categoryName) || ''} bill.
    </span>
  ),

  CreatePublishedPost: data => (
    <span>
      {(data && data.authorName) || ''} published a{' '}
      {(data && data.type) || 'post'}: {(data && data.title) || 'post title'}.
    </span>
  )
}

export default historyMessages
