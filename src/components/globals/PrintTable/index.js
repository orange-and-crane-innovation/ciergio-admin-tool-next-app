import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import { FiPrinter } from 'react-icons/fi'
import Button from '@app/components/button'
import PrintContent from './PrintContent'
import P from 'prop-types'

function PrintTable({ header, subHeaders, tableHeader, tableData }) {
  const printComponentRef = useRef()

  return (
    <>
      <div style={{ display: 'none' }}>
        <PrintContent
          ref={printComponentRef}
          header={header}
          subHeaders={subHeaders}
          tableHeader={tableHeader}
          tableData={tableData}
        />
      </div>
      <ReactToPrint
        trigger={() => <Button icon={<FiPrinter />} />}
        content={() => printComponentRef.current}
      />
    </>
  )
}

PrintTable.propTypes = {
  header: P.string,
  subHeaders: P.array,
  tableHeader: P.array.isRequired,
  tableData: P.array.isRequired
}

export default PrintTable
