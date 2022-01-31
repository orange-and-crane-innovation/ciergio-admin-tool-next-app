import Card from '@app/components/card'
import moment from 'moment'
import styles from './subscriptionscard.module.css'

const CardContent = () => {
  return (
    <div className="flex flex-col">
      <h3 className="text-2xl">Subscriptions</h3>
      <b className="mt-4">Buildings Made</b>
      <span className="text-4xl font-bold mb-8">4/5</span>
      <p className="">Subscriptions Ends</p>
      <span>{moment(new Date()).format('MMMM DD, YYYY')}</span>
    </div>
  )
}

const SubscriptionsCard = () => {
  return (
    <Card
      content={<CardContent />}
      footer={
        <div className="w-100 text-center">
          <span>Upgrade Plan</span>
        </div>
      }
      containerClass={styles.overviewCard}
    />
  )
}

export { SubscriptionsCard }
