import React, { useState } from 'react'
import P from 'prop-types'
import { CgMathEqual } from 'react-icons/cg'
import style from './Draggable.module.css'

const initialDnDState = {
  draggedFrom: null,
  draggedTo: null,
  isDragging: false,
  originalOrder: [],
  updatedOrder: []
}

const Component = ({ list, onListChange }) => {
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState)

  const handleOnDragStart = e => {
    const initialPosition = Number(e.currentTarget.dataset.position)

    setDragAndDrop({
      // we spread the previous content
      // of the hook variable
      // so we don't override the properties
      // not being updated
      ...dragAndDrop,

      draggedFrom: initialPosition, // set the draggedFrom position
      isDragging: true,
      originalOrder: list // store the current state of "list"
    })

    // Note: this is only for Firefox.
    // Without it, the DnD won't work.
    // But we are not using it.
    e.dataTransfer.setData('text/html', '')
  }
  const handleOnDrop = e => {
    // we use the updater function
    // for the "list" hook
    onListChange(dragAndDrop.updatedOrder)

    // and reset the state of
    // the DnD
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    })
  }

  const handleOnDragOver = e => {
    e.preventDefault()

    // Store the content of the original list
    // in this variable that we'll update
    let newList = dragAndDrop.originalOrder

    // index of the item being dragged
    const draggedFrom = dragAndDrop.draggedFrom

    // index of the drop area being hovered
    const draggedTo = Number(e.currentTarget.dataset.position)

    // get the element that's at the position of "draggedFrom"
    const itemDragged = newList[draggedFrom]

    // filter out the item being dragged
    const remainingItems = newList.filter(
      (item, index) => index !== draggedFrom
    )

    // update the list
    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo)
    ]

    // since this event fires many times
    // we check if the targets are actually
    // different:
    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,

        // save the updated list state
        // we will render this onDrop
        updatedOrder: newList,
        draggedTo: draggedTo
      })
    }
  }

  return (
    <ul className={style.Draggable}>
      {list.map((item, index) => (
        <li
          data-position={index}
          key={index}
          onDragStart={handleOnDragStart}
          onDrop={handleOnDrop}
          onDragOver={handleOnDragOver}
          draggable="true"
          className={`${style.DraggableItem} ${
            dragAndDrop?.draggedTo === Number(index) ? style.DropArea : ''
          }`}
        >
          <div className="flex items-center">
            <CgMathEqual className="mr-4" />
            <span>{item.name}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

Component.propTypes = {
  list: P.array,
  onListChange: P.func
}

export default Component
