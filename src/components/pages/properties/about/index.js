/* eslint-disable react/jsx-key */
import React from 'react'
import P from 'prop-types'
import { FiEdit2, FiMapPin, FiMail, FiPhone } from 'react-icons/fi'
import { FaRegUser, FaRegBuilding } from 'react-icons/fa'

import Card from '@app/components/card'
import Button from '@app/components/button'

import styles from './index.module.css'

const CompanyAboutComponent = ({
  address,
  tinNo,
  email,
  contactNo,
  approvedBy,
  onButtonClick
}) => {
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
                    <span>{address}</span>
                  </div>
                </div>
                <hr />

                <div className={styles.CardSubContentContainer}>
                  <span>
                    <FaRegBuilding />
                  </span>
                  <div className={styles.FlexCol}>
                    <span className={styles.ContentTitle}>Company Tin #</span>
                    <span>{tinNo}</span>
                  </div>
                </div>
                <hr />

                <div className={styles.CardSubContentContainer2}>
                  <div className={styles.CardSubContentContainer3}>
                    <span>
                      <FiMail />
                    </span>
                    <div className={styles.FlexCol}>
                      <span className={styles.ContentTitle}>Email Address</span>
                      <span>{email}</span>
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
                      <span>{contactNo}</span>
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
                    <span>{approvedBy}</span>
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

CompanyAboutComponent.defaultProps = {
  address: '---',
  tinNo: '---',
  email: '---',
  contactNo: '---',
  approvedBy: '---'
}

CompanyAboutComponent.propTypes = {
  address: P.string.isRequired,
  tinNo: P.string.isRequired,
  email: P.string.isRequired,
  contactNo: P.string.isRequired,
  approvedBy: P.string.isRequired,
  onButtonClick: P.func.isRequired
}

export default CompanyAboutComponent