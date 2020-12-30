import React from 'react'
import { Draggable } from '@app/components/globals'

const directoryList = [
  {
    id: 0,
    name: 'Red Cross'
  },
  {
    id: 1,
    name: 'PHRC Headquarters'
  },
  {
    id: 2,
    name: 'McDonalds'
  },
  {
    id: 3,
    name: 'Suds Laundry Services'
  }
]

const directoryRowNames = [
  {
    name: 'Reorder',
    width: '10%'
  },
  {
    name: 'Category'
  }
]

function DummyManageDirectoryList() {
  const [list, setList] = React.useState(directoryList)

  return (
    <Draggable
      list={list}
      onListChange={setList}
      rowNames={directoryRowNames}
    />
  )
}

export { DummyManageDirectoryList }
