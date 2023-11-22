import React, { forwardRef, useMemo } from 'react'

import P from 'prop-types'
import styles from './PrintView.module.css'

export const AllStaffPrintView = forwardRef((props, ref) => {
  const { title, data } = props

  const tableData = useMemo(() => {
    return data?.map((item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item?.name}</td>
          <td>{item?.email}</td>
          <td>{item?.role}</td>
          <td>{item?.assignment}</td>
        </tr>
      )
    })
  }, [data])

  const tableHeader = (
    <>
      <th>#</th>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Assignment</th>
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

AllStaffPrintView.displayName = 'AllStaffPrintView'

AllStaffPrintView.propTypes = {
  title: P.string,
  data: P.array
}
