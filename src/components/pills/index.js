import React from 'react'
import PropTypes from 'prop-types'

import styles from './pills.module.css'

const Pills = ({ data, activeKey, onClick }) => {
  return (
    <ul className={styles.pageContainer}>
      {data.map((item, index) => {
        return (
          <li
            key={index}
            className={`${styles.itemContainer} ${
              activeKey === item.value && styles.itemActive
            }`}
          >
            <button onClick={() => onClick(item.value)}>{item.name}</button>
          </li>
        )
      })}
    </ul>
  )
}

Pills.propTypes = {
  data: PropTypes.array,
  activeKey: PropTypes.string,
  onClick: PropTypes.func
}

export default Pills
