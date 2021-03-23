/* eslint-disable react/display-name */
import Link from 'next/link'

const messages = {
  CreateIssue: data => (
    <span>
      {data?.authorName || ''} submitted a{' '}
      <Link href={`/maintenance/details/${data?.issueId}` || ''}>
        <span className="text-blue-500">ticket</span>
      </Link>
      .
    </span>
  ),
  AssignIssue: data => (
    <span>
      {data?.authorName || ''} assigned a{' '}
      <Link href={`/maintenance/details/${data?.issueId}` || ''}>
        {' '}
        <span className="text-blue-500">ticket</span>
      </Link>{' '}
      to {(data?.assigneeName && data?.assigneeName) || ''}.
    </span>
  ),
  OnholdIssue: data => (
    <span>
      {data?.authorName || ''} has placed a{' '}
      <Link href={`/maintenance/details/${data?.issueId} ` || ''}>
        {' '}
        <span className="text-blue-500">ticket</span>
      </Link>{' '}
      on hold.
    </span>
  ),
  ResolveIssue: data => (
    <span>
      {data?.authorName || ''} resolved a{' '}
      <Link href={`/maintenance/details/${data?.issueId}` || ''}>
        {' '}
        <span className="text-blue-500">ticket</span>
      </Link>
      .
    </span>
  ),
  ViewBill: data => (
    <span>
      {`${data?.authorName || ''} has seen ${
        (data?.period && data?.period.month - 1) || 0
      } ${data?.period && data?.period.year} ${data?.categoryName || ''}
       bill.`}
    </span>
  ),
  BillCreated: data => <span>A new bill has been created.</span>
}

export default messages
