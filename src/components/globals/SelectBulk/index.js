import React from 'react'
import PropTypes from 'prop-types'

import FormSelect from '@app/components/forms/form-select'
import Button from '@app/components/button'

import styles from './index.module.css'

const SelectBulkComponent = ({
  placeholder,
  options,
  selected,
  disabled,
  isButtonDisabled,
  isButtonHidden,
  onBulkChange,
  onBulkSubmit,
  onBulkClear,
  custom
}) => {
  return (
    <div
      className={`${styles.BulkControlContainer} ${
        custom ? styles.CustomWidth : ''
      }`}
    >
      <FormSelect
        className="min-w-xs"
        id="bulkSelect"
        name="bulkSelect"
        options={options}
        placeholder={placeholder}
        defaultValue={options.filter(item => item.value === selected)}
        value={options.filter(item => item.value === selected)}
        onChange={onBulkChange}
        onClear={onBulkClear}
        disabled={disabled}
        isClearable
      />
      {!isButtonHidden && (
        <Button
          type="button"
          label="Apply"
          className={styles.BulkControlButton}
          onClick={onBulkSubmit}
          disabled={disabled || isButtonDisabled}
        />
      )}
    </div>
  )
}

SelectBulkComponent.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.array,
  selected: PropTypes.string,
  disabled: PropTypes.bool,
  isButtonDisabled: PropTypes.bool,
  isButtonHidden: PropTypes.bool,
  onBulkChange: PropTypes.func,
  onBulkSubmit: PropTypes.func,
  onBulkClear: PropTypes.func,
  custom: PropTypes.bool
}

export default SelectBulkComponent
