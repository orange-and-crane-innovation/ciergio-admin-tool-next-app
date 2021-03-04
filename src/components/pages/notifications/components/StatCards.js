import { GiAlarmClock } from 'react-icons/gi'
import { GoWatch } from 'react-icons/go'
import styles from '../notifications.module.css'

export default function StatCards() {
  return (
    <div className={styles.statCards}>
      <div className={styles.statCardsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statCardIconContainer}>
            <GiAlarmClock className="h-8 w-8 text-white" />
          </div>
          <div className={styles.statCardContent}>
            <h2 className="font-medium">Notifications Today</h2>
            <p className="text-2xl font-bold">43</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardIconContainer}>
            <GoWatch className="h-8 w-8 text-white" />
          </div>
          <div className={styles.statCardContent}>
            <h2 className="font-medium">Notifications This Week</h2>
            <p className="text-2xl font-bold">107</p>
          </div>
        </div>
      </div>
    </div>
  )
}
