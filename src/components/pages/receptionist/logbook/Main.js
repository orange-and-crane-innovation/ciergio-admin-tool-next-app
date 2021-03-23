import { useState, useEffect } from 'react'
import Table from '@app/components/table'
import Card from '@app/components/card'
import styles from '../main.module.css'
import Button from '@app/components/button'
import { BsPlusCircle } from 'react-icons/bs'
import { useQuery } from '@apollo/client'
import { GET_REGISTRYRECORDS } from '../query'
import P from 'prop-types'

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

function LogBook({ buildingId, categoryId, status }) {
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
            <b className={styles.ReceptionistCardHeader}>Visitors Logbook</b>
            <Button
              primary
              label="Add Visitor"
              leftIcon={<BsPlusCircle />}
              onClick={addVisitor}
            />
          </div>
        }
        content={<Table rowNames={dummyRow} items={[]} />}
      />
    </>
  )
}

LogBook.propTypes = {
  buildingId: P.string.isRequired,
  categoryId: P.string.isRequired,
  status: P.oneOfType[(P.string, P.array)]
}

export default LogBook
