/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-onchange */
import React from 'react'
import PropTypes from 'prop-types'
import Select, { components } from 'react-select'

import styles from './FormSelect.module.css'

const ValueContainer = ({ children, ...props }) => {
  const {
    getValue,
    hasValue,
    isMulti,
    selectProps: { valueholder, inputValue }
  } = props
  const selected = getValue()
  const content = (length => {
    switch (length) {
      case 0:
        return children
      case 1:
        return selected[0].label
      default:
        return `${valueholder} (${selected.length})`
    }
  })(selected.length)

  if (!hasValue || !isMulti) {
    return (
      <components.ValueContainer {...props} className={styles.valueCont}>
        {children}
      </components.ValueContainer>
    )
  }
  return (
    <components.ValueContainer
      {...props}
      className={styles.valueCont}
      css={{ zIndex: 100000 }}
    >
      {!inputValue && content}
      {children[1]}
    </components.ValueContainer>
  )
}

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
  className,
  isMulti,
  isClearable,
  subLabel,
  loading,
  label
}) => {
  return (
    <div className={`${styles.FormSelectContainer} ${className}`}>
      {label ? (
        <label className="font-bold text-base text-neutral-500" htmlFor={name}>
          {label}
        </label>
      ) : null}
      {subLabel || null}
      <Select
        styles={{
          control: base => ({
            ...base,
            borderColor: error ? 'red' : base.borderColor,
            boxShadow: 'none'
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? '#F56222'
              : base.backgroundColor,
            borderBottom: '1px solid #fff'
          }),
          menuPortal: base => ({ ...base, zIndex: 102 })
        }}
        classNamePrefix={styles.FormSelect}
        id={id}
        name={name}
        placeholder={placeholder}
        valueholder={valueholder}
        options={options}
        noOptionsMessage={() => 'No item found.'}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        components={
          isMulti
            ? {
                ValueContainer: ValueContainer,
                IndicatorSeparator: () => null
              }
            : {
                IndicatorSeparator: () => null
              }
        }
        menuPlacement="auto"
        menuPosition="fixed"
        menuPortalTarget={document.body}
        closeMenuOnSelect={!isMulti}
        hideSelectedOptions={false}
        isMulti={isMulti}
        isDisabled={disabled}
        isClearable={isClearable}
        isSearchable
        isLoading={loading}
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
  className: PropTypes.string,
  isMulti: PropTypes.bool,
  isClearable: PropTypes.bool,
  subLabel: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.string
  ]),
  loading: PropTypes.bool,
  label: PropTypes.string
}

export default InputSelect
