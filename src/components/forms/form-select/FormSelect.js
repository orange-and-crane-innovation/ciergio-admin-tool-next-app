/* eslint-disable jsx-a11y/no-onchange */
import React from 'react'
import PropTypes from 'prop-types'
import Select, { components } from 'react-select'

import styles from './FormSelect.module.css'

const InputSelect = ({
  id,
  name,
  defaultValue,
  value,
  placeholder,
  valueholder,
  options,
  error,
  onChange,
  onClear,
  disabled,
  noCloseIcon,
  className,
  description,
  isMulti,
  isClearable
}) => {
  // eslint-disable-next-line react/prop-types
  const ValueContainer = ({ children, ...props }) => {
    // eslint-disable-next-line react/prop-types
    const { getValue, hasValue } = props
    const count = getValue().length
    if (!hasValue) {
      return (
        <components.ValueContainer {...props}>
          {children}
        </components.ValueContainer>
      )
    }
    return (
      <components.ValueContainer {...props}>
        {`${valueholder} (${count})`}
      </components.ValueContainer>
    )
  }

  return (
    <div className={`${styles.FormSelectContainer} ${className}`}>
      {description || null}
      <Select
        styles={{
          control: styles => ({
            ...styles,
            borderColor: error ? 'red' : styles.borderColor
          })
        }}
        classNamePrefix="FormSelect"
        id={id}
        name={name}
        placeholder={placeholder}
        options={options}
        noOptionsMessage={() => 'No item found.'}
        defaultValue={defaultValue}
        disabled={disabled}
        components={
          isMulti
            ? {
                ValueContainer,
                IndicatorSeparator: () => null
              }
            : {
                IndicatorSeparator: () => null
              }
        }
        menuPlacement="auto"
        closeMenuOnSelect={!isMulti}
        hideSelectedOptions={false}
        isMulti={isMulti}
        isDisabled={disabled}
        isClearable={isClearable}
        isSearchable
        onChange={(selectedOption, triggeredAction) => {
          if (triggeredAction.action === 'clear') {
            onClear()
          } else {
            onChange(selectedOption)
          }
        }}
      />
      <div className={styles.FormSelectError}>{error}</div>
    </div>
  )
}

InputSelect.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  valueholder: PropTypes.string,
  options: PropTypes.array.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  disabled: PropTypes.bool,
  noCloseIcon: PropTypes.bool,
  className: PropTypes.string,
  description: PropTypes.node || PropTypes.string,
  isMulti: PropTypes.bool,
  isClearable: PropTypes.bool
}

export default InputSelect
