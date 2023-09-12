import React, { forwardRef, useMemo } from 'react'

import P from 'prop-types'
import styles from './PrintView.module.css'

export const PrintView = forwardRef((props, ref) => {
  const { title, data } = props

  const tableData = useMemo(() => {
    return data?.map((item, index) => {
      const address = item?.businessAddress

      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item?.businessName}</td>
          <td>{item?.businessDisplayName}</td>
          <td>{`${address?.unitOrFloor ?? ''} ${
            address?.streetOrBuildingName ?? ''
          } ${address?.barangay ?? ''} ${
            (address?.city ?? '') || (address?.province ?? '')
          }`}</td>
          <td>{item?.businessRegNumber}</td>
          <td>{item?.businessContactNumber}</td>
          <td width={150} className="break-all">
            {item?.businessEmail}
          </td>
          <td>{`${item?.firstName} ${item?.lastName}`}</td>
          <td>{item?.businessBarangayPermit}</td>
          <td>{item?.businessPrimaryPayment}</td>
        </tr>
      )
    })
  }, [data])

  const tableHeader = (
    <>
      <th>#</th>
      <th>Business Name</th>
      <th>Business Display Name</th>
      <th>Business Address</th>
      <th>Business Reg. Number</th>
      <th>Business Contact No.</th>
      <th>Business Email</th>
      <th>Customer Name</th>
      <th>Barangay Permit</th>
      <th>Primary Payment</th>
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

PrintView.displayName = 'PrintView'

PrintView.propTypes = {
  title: P.string,
  data: P.array
}
