import React, { useMemo } from 'react'
import P from 'prop-types'

import Toggle from '@app/components/toggle'
import { IMAGES } from '@app/constants'

import styles from './Unsubscribe.module.css'

function Unsubscribe({ onToggle, toggleData, email }) {
  const renderSubsSwitchers = useMemo(() => {
    return toggleData.length > 0
      ? toggleData.map(item => {
          return (
            <div key={item.name} className={styles.settingsSubContainer}>
              <div className={styles.settingsHeader}>
                <div>
                  <strong>{item.title}</strong>
                </div>
                <div>{item.description}</div>
              </div>
              <Toggle
                onChange={() => onToggle(item.name)}
                defaultChecked={item.status}
              />
            </div>
          )
        })
      : null
  }, [onToggle, toggleData])

  return (
    <div className={styles.unsubscribe}>
      <div className={styles.logo}>
        <img src={IMAGES.DEFAULT_LOGO_H} alt="logo" />
      </div>

      <div className={styles.main}>
        <div className={styles.title}>Email Settings</div>

        <div className={styles.content}>
          <span>
            Keep up to date with your community and your unit via email.
          </span>

          <div className={styles.unitContainer}>
            <div className={styles.unitSubContainer}>
              <div className={styles.unitHeader}>Your Email: </div>
              <div className={styles.unitContent}>
                <strong>{email}</strong>
              </div>
            </div>
          </div>

          <div className={styles.settingsContainer}>{renderSubsSwitchers}</div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerText}>Powered by</div>
        <div className={styles.footerLogo}>
          <img src={IMAGES.DEFAULT_LOGO_MONO_MINI} width="90px" alt="logo" />
        </div>
      </div>
    </div>
  )
}

Unsubscribe.defaultProps = {
  toggleData: []
}

Unsubscribe.propTypes = {
  onToggle: P.func.isRequired,
  toggleData: P.array,
  email: P.string
}

export default React.memo(Unsubscribe)
