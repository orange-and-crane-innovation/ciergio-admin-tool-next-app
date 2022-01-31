import styles from './about.module.css'
import Card from '@app/components/card'
import { SubscriptionsCard } from '../common'
import Input from '@app/components/forms/form-input'
import Props from 'prop-types'
import Button from '@app/components/button'
import { FiEdit } from 'react-icons/fi'

const CommonContainerWithDivider = ({ icon, title, detail }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        {icon && <i className={`icon ${icon}`}></i>}
      </div>
      <div className={styles.detailsContainer}>
        <span>{title} </span>
        <span>{detail}</span>
      </div>
    </div>
  )
}

// this is only a dummy details since we dont have a api for this
const ABOUTCARDDETAILS = [
  {
    icon: 'ciergio-map-pin',
    title: 'Address ',
    detail:
      '1 Balete Drive corner N. Domingo St Brgy Kaunlaran, District 4, New Manila, Quezon City, Metro Manila'
  },
  {
    icon: 'ciergio-building',
    title: 'Company Tin #',
    detail: '9999-9999-9999V'
  },
  {
    icon: 'ciergio-email-at',
    title: 'Company Email Address',
    detail: 'hello@orangeandcraneholdings.com'
  },
  {
    icon: 'ciergio-phone',
    title: 'Contact Number',
    detail: '02-740-1234'
  },
  {
    icon: 'ciergio-user',
    title: 'Approved By',
    detail: 'Jiggy Lapez'
  }
]
const AboutCardContent = () => {
  return (
    <div className={styles.cardContent}>
      {ABOUTCARDDETAILS.map((detail, index) => {
        return (
          <CommonContainerWithDivider
            icon={detail.icon}
            title={detail.title}
            detail={detail.detail}
            key={index}
          />
        )
      })}
    </div>
  )
}

const RecentActivityCardContent = () => {
  return (
    <div className="flex flex-col">
      <span>
        Provide the email address where email blasts will come from. By default
        emails will come from admin@ciergio.com
      </span>
      <div className="w-1/4 mt-5">
        <Input
          label="Email address for email blast"
          placeholder="admin@och.com"
        />
      </div>
    </div>
  )
}

const AboutCard = () => {
  return (
    <Card
      header={
        <div className="flex flex-row justify-between">
          <h2 className="font-bold text-lg">About</h2>
          <Button
            label="Edit"
            className="bg-white text-black"
            leftIcon={<FiEdit size={20} />}
          />
        </div>
      }
      content={<AboutCardContent />}
      noPadding={true}
    />
  )
}

const RecentActivityTable = () => {
  return (
    <Card
      header={
        <div>
          <h2 className="font-bold text-lg">Email Blast Settings</h2>
        </div>
      }
      content={<RecentActivityCardContent />}
    />
  )
}

const AccountTab = () => {
  return (
    <div className="p-4 flex flex-row justify-between">
      <div className={styles.tableContainer}>
        <AboutCard />
        <RecentActivityTable />
      </div>
      <SubscriptionsCard />
    </div>
  )
}

CommonContainerWithDivider.propTypes = {
  detail: Props.string.isRequired,
  title: Props.string.isRequired,
  icon: Props.string.isRequired
}

export { AccountTab }
