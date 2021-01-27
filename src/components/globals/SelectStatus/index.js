import React from 'react'
import PropTypes from 'prop-types'

import FormSelect from '@app/components/forms/form-select'

import styles from './index.module.css'

const filterOptions = [
  {
    label: 'Draft',
    value: 'draft'
  },
  {
    label: 'Published',
    value: 'published'
  },
  {
    label: 'Scheduled',
    value: 'scheduled'
  },
  {
    label: 'Unpublished',
    value: 'unpublished'
  }
]

const SelectStatusComponent = ({
  placeholder,
  selected,
  onChange,
  onClear
}) => {
  return (
    <div className={styles.SelectStatusContainer}>
      <FormSelect
        name="status"
        placeholder={placeholder}
        noOptionsMessage={() => 'No item found.'}
        value={filterOptions.filter(item => item.value === selected)}
        options={filterOptions}
        onChange={onChange}
        onClear={onClear}
        isClearable
      />
    </div>
  )
}

SelectStatusComponent.propTypes = {
  placeholder: PropTypes.string,
  selected: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func
}

export default SelectStatusComponent
