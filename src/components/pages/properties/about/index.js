/* eslint-disable react/jsx-key */
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import P from 'prop-types'
import { FiEdit2, FiMapPin, FiMail, FiPhone } from 'react-icons/fi'
import { FaRegUser, FaRegBuilding } from 'react-icons/fa'

import Card from '@app/components/card'
import Button from '@app/components/button'

import styles from './index.module.css'

const AboutComponent = ({
  type,
  address,
  tinNo,
  email,
  contactNo,
  approvedBy,
  onButtonClick
}) => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/properties/${type}/${router.query.id}/about`)
  }, [])

  return (
    <div className={styles.PageContainer}>
      <div className="flex">
        <div className={styles.PageSubContainer}>
          <Card
            noPadding
            header={
              <div className={styles.FlexCenterBetween}>
                <span className={styles.CardHeader}>About</span>
                <Button
                  default
                  leftIcon={<FiEdit2 />}
                  label="Edit"
                  onClick={onButtonClick}
                />
              </div>
            }
            content={
              <div className={styles.CardContentContainer}>
                <div className={styles.CardSubContentContainer}>
                  <span>
                    <FiMapPin />
                  </span>
                  <div className={styles.FlexCol}>
                    <span className={styles.ContentTitle}>Address</span>
                    <span>{address || 'Not available'}</span>
                  </div>
                </div>
                <hr />

                {type === 'company' && (
                  <>
                    <div className={styles.CardSubContentContainer}>
                      <span>
                        <FaRegBuilding />
                      </span>
                      <div className={styles.FlexCol}>
                        <span className={styles.ContentTitle}>
                          Company Tin #
                        </span>
                        <span>{tinNo || 'Not available'}</span>
                      </div>
                    </div>
                    <hr />
                  </>
                )}

                <div className={styles.CardSubContentContainer2}>
                  <div className={styles.CardSubContentContainer3}>
                    <span>
                      <FiMail />
                    </span>
                    <div className={styles.FlexCol}>
                      <span className={styles.ContentTitle}>Email Address</span>
                      <span>{email || 'Not available'}</span>
                    </div>
                  </div>

                  <div className={styles.CardSubContentContainer3}>
                    <span>
                      <FiPhone />
                    </span>
                    <div className={styles.FlexCol}>
                      <span className={styles.ContentTitle}>
                        Contact Number
                      </span>
                      <span>{contactNo || 'Not available'}</span>
                    </div>
                  </div>
                </div>
                <hr />
                <div className={styles.CardSubContentContainer}>
                  <span>
                    <FaRegUser />
                  </span>
                  <div className={styles.FlexCol}>
                    <span className={styles.ContentTitle}>Approved By</span>
                    <span>{approvedBy || 'Not available'}</span>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}

AboutComponent.defaultProps = {
  address: 'Not available',
  tinNo: 'Not available',
  email: 'Not available',
  contactNo: 'Not available',
  approvedBy: 'Not available'
}

AboutComponent.propTypes = {
  type: P.string.isRequired,
  address: P.string.isRequired,
  tinNo: P.string.isRequired,
  email: P.string.isRequired,
  contactNo: P.string.isRequired,
  approvedBy: P.string.isRequired,
  onButtonClick: P.func.isRequired
}

export default AboutComponent
