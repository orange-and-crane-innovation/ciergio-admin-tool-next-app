/* eslint-disable jsx-a11y/no-onchange */
import styles from './FormSelect.module.css'
import React from 'react'
import PropTypes from 'prop-types'

const InputSelect = ({ options, onChange, disabled }) => {
  return (
    <React.Fragment>
      <select
        className={styles.FormSelect}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((item, index) => {
          return (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </select>
    </React.Fragment>
  )
}

InputSelect.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
}

export default InputSelect
