import { useState, useEffect } from 'react'
import Table from '@app/components/table'
import Card from '@app/components/card'
import styles from '../main.module.css'
import Button from '@app/components/button'
import { BsPlusCircle } from 'react-icons/bs'
import { FiPrinter, FiDownload } from 'react-icons/fi'
import { useQuery } from '@apollo/client'
import { GET_REGISTRYRECORDS } from '../query'
import P from 'prop-types'

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

function Cancelled({ buildingId, categoryId, status }) {
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [sort, setSort] = useState(1)
  const [sortBy, setSortBy] = useState('checkedIn')

  const { loading, error, data, refetch } = useQuery(GET_REGISTRYRECORDS, {
    variables: {
      limit,
      offset,
      sort,
      sortBy,
      where: {
        buildingId,
        categoryId,
        status,
        checkedInAt: ['2021-03-23T00:00:00+08:00', '2021-03-23T23:59:59+08:00'],
        keyword: null
      }
    }
  })

  useEffect(() => {
    if (!loading && !error && data) {
      console.log(data)
    }
  }, [loading, error, data])

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

Cancelled.propTypes = {
  buildingId: P.string.isRequired,
  categoryId: P.string.isRequired,
  status: P.oneOfType[(P.string, P.array)]
}

export default Cancelled
