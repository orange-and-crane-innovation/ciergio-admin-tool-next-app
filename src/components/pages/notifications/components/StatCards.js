import { GiAlarmClock } from 'react-icons/gi'
import { GoWatch } from 'react-icons/go'
import styles from '../notifications.module.css'

export default function StatCards() {
  return (
    <div className={styles.statCards}>
      <div className="col-span-2 col-start-1 col-end-3 flex justify-start">
        <div className="w-64 h-32 box-border p-0 bg-white mr-4 shadow-sm rounded border border-neutral-300 flex">
          <div className={styles.statCardIconContainer}>
            <GiAlarmClock className="h-8 w-8 text-white" />
          </div>
          <div className="flex justify-center flex-col pl-4">
            <h2 className="font-medium">Notifications Today</h2>
            <p className="text-2xl font-bold">43</p>
          </div>
        </div>
        <div className="w-64 h-32 box-border p-0 bg-white shadow-sm rounded border border-neutral-300 flex">
          <div className={styles.statCardIconContainer}>
            <GoWatch className="h-8 w-8 text-white" />
          </div>
          <div className="flex justify-center flex-col pl-4">
            <h2 className="font-medium">Notifications This Week</h2>
            <p className="text-2xl font-bold">107</p>
          </div>
        </div>
      </div>
    </div>
  )
}
