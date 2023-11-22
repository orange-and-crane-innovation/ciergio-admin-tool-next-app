import React, { forwardRef, useMemo } from 'react'

import P from 'prop-types'
import styles from './PrintView.module.css'

export const PendingStaffPrintView = forwardRef((props, ref) => {
  const { title, data } = props

  const tableData = useMemo(() => {
    return data?.map((item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item?.invites}</td>
          <td>{item?.accountType}</td>
          <td>{item?.assignment}</td>
          <td>{item?.createdAt}</td>
        </tr>
      )
    })
  }, [data])

  const tableHeader = (
    <>
      <th>#</th>
      <th>Email</th>
      <th>Role</th>
      <th>Assignment</th>
      <th>Date Sent</th>
    </>
  )

  return (
    <div ref={ref} className={styles.PrintContainer}>
      <h2 className={styles.PrintTitle}>{title}</h2>
      <table className={styles.PrintTable}>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableData}</tbody>
      </table>
    </div>
  )
})

PendingStaffPrintView.displayName = 'PendingStaffPrintView'

PendingStaffPrintView.propTypes = {
  title: P.string,
  data: P.array
}
