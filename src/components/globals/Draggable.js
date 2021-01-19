import React, { useRef, useCallback } from 'react'
import P from 'prop-types'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'

import style from './Draggable.module.css'

const itemType = {
  LIST: 'li'
}

const Component = ({ list, onListChange, rowNames }) => {
  const hasReorderColumn = rowNames.find(row => row.name === 'Reorder')

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
        item={item}
        onMoveCard={moveCard}
        reorder={hasReorderColumn !== undefined}
      />
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <table className={style.Draggable}>
        {rowNames?.length > 0 ? (
          <thead>
            <tr>
              {!hasReorderColumn ? <th> </th> : null}
              {rowNames.map((row, index) => (
                <th key={index} width={row.width}>
                  {row.name}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {list.map((item, index) => (
            <React.Fragment key={index}>
              {renderListItem(item, index)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </DndProvider>
  )
}

Component.propTypes = {
  list: P.array,
  onListChange: P.func,
  rowNames: P.array
}

const ListItem = ({ index, id, onMoveCard, item }) => {
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

  const listItem = Object?.entries(item).map(([key, value], rowIndex) => {
    if (key !== 'id') {
      return (
        <td key={rowIndex} className={style.ItemData}>
          <span>{value}</span>
        </td>
      )
    }

    return null
  })

  return (
    <tr
      ref={listItemRef}
      style={{ opacity: isDragging ? 0.3 : 1 }}
      className={style.DraggableItem}
    >
      <td className={[style.ItemData, style.DragIcon].join(' ')}>
        <span className="ciergio-reorder" />
      </td>
      {listItem}
    </tr>
  )
}

ListItem.propTypes = {
  item: P.object,
  index: P.number,
  onMoveCard: P.func,
  text: P.string,
  id: P.number,
  reorder: P.bool || P.object
}

export default Component
