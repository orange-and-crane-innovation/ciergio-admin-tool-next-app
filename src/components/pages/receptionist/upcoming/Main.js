import { useState, useEffect } from 'react'
import Table from '@app/components/table'
import Card from '@app/components/card'
import styles from '../main.module.css'
import Button from '@app/components/button'
import { BsPlusCircle } from 'react-icons/bs'
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

function Upcoming({ buildingId, categoryId }) {
  useEffect(() => {
    console.log({
      building: buildingId,
      category: categoryId
    })
  }, [buildingId, categoryId])
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
              leftIcon={<BsPlusCircle />}
              onClick={addVisitor}
            />
          </div>
        }
        content={<Table rowNames={dummyRow} items={{ data: [] }} />}
      />
    </>
  )
}

Upcoming.propTypes = {
  buildingId: P.string.isRequired,
  categoryId: P.string.isRequired
}

export default Upcoming
