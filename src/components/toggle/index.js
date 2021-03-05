import { useState, useEffect } from 'react'
import P from 'prop-types'
import { GoCheck } from 'react-icons/go'

import styles from './toggle.module.css'

export default function Toggle(props) {
  const [toggle, setToggle] = useState(false)
  const { defaultChecked, onChange, disabled } = props

  useEffect(() => {
    if (defaultChecked) {
      setToggle(defaultChecked)
    }
  }, [defaultChecked])

  const triggerToggle = () => {
    if (disabled) {
      return
    }

    setToggle(!toggle)

    if (typeof onChange === 'function') {
      onChange(!toggle)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      onClick={triggerToggle}
      className={`${styles.toggle} ${disabled ? styles.toggleDisabled : ''}`}
    >
      <div
        className={`${styles.toggleContainer} ${
          toggle ? 'bg-success-600' : 'bg-neutral-300'
        }`}
      />
      <div className={`${styles.toggleCircle} ${toggle ? 'left-4' : 'left-0'}`}>
        <GoCheck
          className={
            toggle ? 'block text-success-600 text-base font-bold' : 'hidden'
          }
        />
      </div>
      <input
        type="checkbox"
        aria-label="Toggle Button"
        className={styles.toggleInput}
      />
    </div>
  )
}

Toggle.propTypes = {
  disabled: P.bool,
  defaultChecked: P.bool,
  onChange: P.func
}
