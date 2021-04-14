import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { FaSpinner } from 'react-icons/fa'

import FormSelect from '@app/components/forms/form-select'

import styles from './index.module.css'

const GET_BUILDINGS_QUERY = gql`
  query getBuildings($where: GetBuildingsParams, $limit: Int, $skip: Int) {
    getBuildings(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        name
      }
    }
  }
`

const SelectBuildingComponent = ({
  type,
  userType,
  selected,
  error,
  onChange,
  onClear
}) => {
  const [lists, setLists] = useState()

  const {
    loading: loadingBuildings,
    data: dataBuildings,
    error: errorBuildings
  } = useQuery(GET_BUILDINGS_QUERY, {
    enabled: false,
    variables: {
      where: {
        status: type
      },
      limit: 500,
      skip: 0
    }
  })

  useEffect(() => {
    if (!loadingBuildings && dataBuildings) {
      const dataLists = dataBuildings?.getBuildings?.data.map((item, index) => {
        return {
          value: item._id,
          label: item.name
        }
      })
      setLists(dataLists)
    }
  }, [loadingBuildings, dataBuildings, errorBuildings])

  if (loadingBuildings) {
    return (
      <div className={styles.SelectCategorySpinnerContainer}>
        <FaSpinner className="icon-spin" />
      </div>
    )
  }

  return (
    <div className={styles.SelectCompanyContainer}>
      <FormSelect
        name="buildingIds"
        placeholder={'Select a Building'}
        valueholder="Building"
        noOptionsMessage={() => 'No item found.'}
        defaultValue={selected}
        options={lists || []}
        onChange={onChange}
        onClear={onClear}
        isMulti={true}
      />
    </div>
  )
}

SelectBuildingComponent.propTypes = {
  type: PropTypes.string,
  userType: PropTypes.string,
  selected: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func
}

export default SelectBuildingComponent
