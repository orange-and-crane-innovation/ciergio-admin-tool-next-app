import { useMemo } from 'react'
import Select from 'react-select'
import P from 'prop-types'

const customStyles = {
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: 'none'
  })
}

function Component({
  options,
  isSearchable,
  isClearable,
  placeholder,
  inputProps,
  error,
  containerClasses,
  errorClasses,
  description,
  rtl,
  disabled,
  loading,
  allowMultiple,
  value,
  inputValue,
  onChange,
  name
}) {
  const renderError = useMemo(() => {
    return error ? <span className={errorClasses}>{error}</span> : null
  }, [error, errorClasses])

  const renderDescription = useMemo(() => {
    if (!description) return null

    return description
  }, [description])

  return (
    <div className={containerClasses}>
      {renderDescription}
      <Select
        options={options}
        isClearable={isClearable}
        isSearchable={isSearchable}
        placeholder={placeholder}
        loading={loading}
        disabled={disabled}
        rtl={rtl}
        isMulti={allowMultiple}
        styles={customStyles}
        inputValue={inputValue}
        value={value}
        onChange={onChange}
        name={name}
        {...inputProps}
      />
      {renderError}
    </div>
  )
}

Component.defaultProps = {
  isMulti: false,
  isSearchable: true,
  isClearable: true,
  rtl: false,
  disabled: false,
  loading: false
}

Component.propTypes = {
  options: P.array,
  isSearchable: P.bool,
  isClearable: P.bool,
  rtl: P.bool,
  disabled: P.bool,
  loading: P.bool,
  allowMultiple: P.bool,
  placeholder: P.string,
  inputProps: P.object,
  error: P.string,
  errorClasses: P.string,
  description: P.node || P.string,
  containerClasses: P.string,
  name: P.string,
  value: P.any,
  onChange: P.func,
  inputValue: P.string
}

export default Component
