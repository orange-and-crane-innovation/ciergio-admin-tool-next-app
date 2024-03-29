import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { FaTimes } from 'react-icons/fa'

import FormInput from '@app/components/forms/form-input'

import styles from './index.module.css'

const SearchComponent = ({
  placeholder,
  searchText,
  fluid,
  onSearch,
  onClearSearch
}) => {
  const containerClasses = useMemo(
    () =>
      clsx(styles.SearchControlContainer, {
        [styles.fluid]: !!fluid
      }),
    [fluid]
  )

  const handleClearSearch = () => {
    document.getElementById('search').value = ''
    onClearSearch()
  }

  return (
    <div className={containerClasses}>
      <FormInput
        id="search"
        name="search"
        placeholder={placeholder}
        inputClassName="pr-8"
        onChange={onSearch}
      />
      <span className={styles.SearchControlIcon}>
        {searchText ? (
          <FaTimes className="cursor-pointer" onClick={handleClearSearch} />
        ) : (
          <span className="ciergio-search text-lg" />
        )}
      </span>
    </div>
  )
}

SearchComponent.propTypes = {
  placeholder: PropTypes.string,
  searchText: PropTypes.string,
  fluid: PropTypes.bool,
  onSearch: PropTypes.func,
  onClearSearch: PropTypes.func
}

export default SearchComponent
