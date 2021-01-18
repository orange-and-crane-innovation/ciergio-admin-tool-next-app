import React, { useEffect } from 'react'
import P from 'prop-types'
import { Draggable } from '@app/components/globals'

const directoryRowNames = [
  {
    name: 'Reorder',
    width: '10%'
  },
  {
    name: 'Category'
  }
]

function ManageDirectory({ data }) {
  const [list, setList] = React.useState(data)

  useEffect(() => {
    setList(data)
  }, [data])

  return (
    <Draggable
      list={list}
      onListChange={setList}
      rowNames={directoryRowNames}
    />
  )
}

ManageDirectory.propTypes = {
  data: P.array
}

export default ManageDirectory
