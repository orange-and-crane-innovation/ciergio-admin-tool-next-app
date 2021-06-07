import React from 'react'
import P from 'prop-types'
import styles from './Main.module.css'

// eslint-disable-next-line react/display-name
const PrintContent = React.forwardRef(
  ({ header, subHeaders, tableHeader, tableData }, ref) => {
    return (
      <>
        <div ref={ref} className={styles.printComponentContainer}>
          <h2 className={styles.printHeader}>{header}</h2>
          <br />

          {subHeaders &&
            subHeaders.map((subheader, index) => (
              <div key={index} className={styles.subHeaderContainer}>
                <bold className={styles.subHeadersTitle}>
                  {subheader.title}:&nbsp;
                </bold>
                <p className={styles.subHeadersContent}>{subheader.content}</p>
              </div>
            ))}
          <br />

          <div>
            <table className={styles.printTable}>
              <tr className={styles.printTableHeader}>
                {tableHeader.map((header, index) => {
                  return <td key={index}>{header}</td>
                })}
              </tr>

              {tableData.map((tr, trIndex) => {
                return (
                  <tr key={trIndex} className={styles.printTableData}>
                    {tr.map((td, tdIndex) => (
                      <td key={tdIndex}>{td}</td>
                    ))}
                  </tr>
                )
              })}
            </table>
          </div>
        </div>
      </>
    )
  }
)

PrintContent.propTypes = {
  header: P.string,
  subHeaders: P.array,
  tableHeader: P.array.isRequired,
  tableData: P.array.isRequired
}

export default PrintContent
