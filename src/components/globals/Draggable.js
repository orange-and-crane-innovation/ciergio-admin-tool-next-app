import React, { useRef, useCallback } from 'react'
import P from 'prop-types'
import { CgMathEqual } from 'react-icons/cg'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'

import style from './Draggable.module.css'

const itemType = {
  LIST: 'li'
}

const Component = ({ list, onListChange }) => {
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = list[dragIndex]
      onListChange(
        update(list, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragItem]
          ]
        })
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list]
  )

  const renderListItem = (item, index) => {
    return (
      <ListItem
        key={item.id}
        index={index}
        id={item.id}
        text={item.name}
        onMoveCard={moveCard}
      />
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <table className={style.Draggable}>
        <thead>
          <tr>
            <th scope="col">Reorder</th>
            <th scope="col">Category</th>
          </tr>
        </thead>
        <tbody>{list.map((item, index) => renderListItem(item, index))}</tbody>
      </table>
    </DndProvider>
  )
}

Component.propTypes = {
  list: P.array,
  onListChange: P.func
}

const ListItem = ({ index, id, onMoveCard, text }) => {
  const listItemRef = useRef(null)

  const [, drop] = useDrop({
    accept: itemType.LIST,
    hover(listItem, monitor) {
      if (!listItemRef.current) {
        return
      }

      const dragIndex = listItem.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = listItemRef.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      onMoveCard(dragIndex, hoverIndex)

      listItem.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    item: { type: itemType.LIST, id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(listItemRef))

  return (
    <tr
      ref={listItemRef}
      style={{ opacity: isDragging ? 0.3 : 1, cursor: 'move' }}
    >
      <td>
        <CgMathEqual className="mr-4" />
      </td>
      <td>
        <span>{text}</span>
      </td>
    </tr>
  )
}

ListItem.propTypes = {
  item: P.object,
  index: P.number,
  onMoveCard: P.func,
  text: P.string,
  id: P.number
}

export default Component
