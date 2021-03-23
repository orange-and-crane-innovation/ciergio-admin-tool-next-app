import Table from '@app/components/table'
import Card from '@app/components/card'
import styles from '../main.module.css'
import Button from '@app/components/button'
import { BsPlusCircle } from 'react-icons/bs'
import { FiPrinter, FiDownload } from 'react-icons/fi'

const dummyRow = [
  {
    name: 'Unit',
    width: `${2 / 100}%`
  },
  {
    name: 'Person/Company',
    width: `${2 / 100}%`
  }
]

function Cancelled() {
  const addVisitor = e => {
    e.preventDefault()
  }
  return (
    <>
      <Card
        noPadding
        header={
          <div className={styles.ReceptionistCardHeaderContainer}>
            <b className={styles.ReceptionistCardHeader}>Cancelled Logbook</b>
            <div className={styles.ReceptionistButtonCard}>
              <Button icon={<FiPrinter />} />
              <Button icon={<FiDownload />} />
              <Button
                primary
                label="Add Visitor"
                leftIcon={<BsPlusCircle />}
                onClick={addVisitor}
              />
            </div>
          </div>
        }
        content={<Table rowNames={dummyRow} items={[]} />}
      />
    </>
  )
}

export default Cancelled
