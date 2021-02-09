import React from 'react'
import PropTypes from 'prop-types'
import { FaTimes, FaSearch } from 'react-icons/fa'

import FormInput from '@app/components/forms/form-input'

import styles from './index.module.css'

const SearchComponent = ({
  placeholder,
  searchText,
  onSearch,
  onClearSearch
}) => {
  const handleClearSearch = () => {
    document.getElementById('search').value = ''
    onClearSearch()
  }

  return (
    <div className={styles.SearchControlContainer}>
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
          <FaSearch />
        )}
      </span>
    </div>
  )
}

SearchComponent.propTypes = {
  placeholder: PropTypes.string,
  searchText: PropTypes.string,
  onSearch: PropTypes.func,
  onClearSearch: PropTypes.func
}

export default SearchComponent
