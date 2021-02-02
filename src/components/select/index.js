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
  name,
  hasCheckbox
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
        isDisabled={disabled}
        rtl={rtl}
        isMulti={allowMultiple}
        inputValue={inputValue}
        value={value}
        onChange={onChange}
        name={name}
        styles={customStyles}
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#f56222'
          }
        })}
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
  inputValue: P.string,
  hasCheckbox: P.bool
}

export default Component
