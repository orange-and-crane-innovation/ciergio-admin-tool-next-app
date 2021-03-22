import Table from '@app/components/table'
import Card from '@app/components/card'
import styles from '../main.module.css'
import Button from '@app/components/button'
import { BsPlusCircle } from 'react-icons/bs'

const dummyRow = [
  {
    name: 'Unit',
    width: `${4 / 100}%`
  },
  {
    name: 'Person/Company',
    width: `${4 / 100}%`
  },
  {
    name: 'Checked In',
    width: `${4 / 100}%`
  },
  {
    name: 'Checked Out',
    width: `${4 / 100}%`
  }
]

function Upcoming() {
  const addVisitor = e => {
    e.preventDefault()
  }
  return (
    <>
      <Card
        noPadding
        header={
          <div className={styles.ReceptionistCardHeaderContainer}>
            <b className={styles.ReceptionistCardHeader}>Upcoming Visitors</b>
            <Button
              primary
              label="Add Visitor"
              rightIcon={<BsPlusCircle />}
              onClick={addVisitor}
            />
          </div>
        }
        content={<Table rowNames={dummyRow} items={[]} />}
      />
    </>
  )
}

export default Upcoming
