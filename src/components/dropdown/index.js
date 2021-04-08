import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import styles from './dropdown.module.css'

const Dropdown = ({ label, items }) => {
  const dropdownRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [isBottom, setIsBottom] = useState(false)

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleDropdown = e => {
    if (e?.clientY) {
      const windowSize = window.innerWidth

      if (windowSize < 1000) {
        setIsBottom(e.clientY > 400)
      } else {
        setIsBottom(e.clientY > 500)
      }
    }

    setIsOpen(!isOpen)
  }

  const handleOutsideClick = e => {
    if (dropdownRef.current.contains(e.target)) {
      return
    }
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={styles.dropdownContainer}>
      <button
        className={`${styles.dropdownControl} ${
          isOpen && styles.dropdownControlActive
        }`}
        type="button"
        onClick={handleDropdown}
      >
        <div className={styles.dropdownControlContainer}>{label}</div>
      </button>
      <div
        className={`${styles.dropdownContent} ${isOpen && styles.open} ${
          isBottom && styles.bottomPlacement
        }`}
      >
        {items.map((item, index) => {
          return (
            <div
              key={index}
              aria-hidden={true}
              onClick={() => {
                item.function()
                handleDropdown()
              }}
            >
              <span className="pr-2">{item.icon}</span>
              {item.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

Dropdown.propTypes = {
  label: PropTypes.any.isRequired,
  items: PropTypes.any.isRequired
}

export default Dropdown
