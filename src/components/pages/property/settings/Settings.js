import Toggle from '@app/components/toggle'
import styles from './settings.module.css'
import Select from '@app/components/forms/form-select'
import Button from '@app/components/button'
import Props from 'prop-types'

const activityHistoryOptions = [
  {
    label: '1 Day',
    value: '1day'
  },
  {
    label: '1 Week',
    value: '1week'
  },
  {
    label: '1 Month',
    value: '1month'
  },
  {
    label: 'Forever',
    value: 'forever'
  }
]

const SettingsModules = [
  {
    label: 'Bulletin Board'
  },
  {
    label: 'QR Code'
  },
  {
    label: 'Messages'
  },
  {
    label: 'Guest and Delivery'
  },
  {
    label: 'Maintenance & Repairs'
  },
  {
    label: 'My Dues'
  },
  {
    label: 'Notifications'
  },
  {
    label: 'Directory'
  },
  {
    label: 'Forms'
  },
  {
    label: 'Contact Page'
  },
  {
    label: 'Donations'
  },
  {
    label: 'Community Board'
  }
]

const ToggleSettings = ({ settings }) => {
  return (
    <div className="flex flex-col">
      {settings &&
        settings.map((setting, index) => {
          return (
            <div key={index} className={styles.withToggle}>
              <p className="font-bold text-lg">{setting.label}</p>
              <Toggle />
            </div>
          )
        })}
    </div>
  )
}

const SettingsTab = () => {
  return (
    <div className="my-10">
      <div className="w-5/6">
        <h1 className="font-bold text-xl">General</h1>
        <div className={styles.withToggle}>
          <div className="mr-5">
            <p className="font-bold text-lg">Allow public Posts and View</p>
            <p>
              Allow this company and every property under them to post content
              in some features publicly (ex. Bulletin Board. ) Sign in on the
              mobile app isnt`t required when this is turned on.
            </p>
          </div>
          <Toggle />
        </div>
        <div className="pb-5 border-neutral-400 border-b">
          <div className="mr-10">
            <p className="font-bold text-lg">Keep Activity History</p>
            <p>
              How long Ciergio keeps the logs available for users and properties
            </p>
          </div>
          <div className="w-1/4">
            <Select options={activityHistoryOptions} />
          </div>
        </div>
        <div className="mt-5 pb-5 border-neutral-400 border-b">
          <div className="mr-10">
            <p className="font-bold text-lg">
              Days before permanent delete of posts in trash
            </p>
            <p>
              Affected modules will be: Bulletin Bard, QR Code, and
              Notifications
            </p>
          </div>
          <div className="w-1/4">
            <Select options={activityHistoryOptions} />
          </div>
        </div>
        <div className="mt-5">
          <div className="mr-10">
            <p className="font-bold text-lg">Modules</p>
            <p>
              Every property in this company will have access to the enabled
              modules.
            </p>
          </div>
        </div>
        <ToggleSettings settings={SettingsModules} />
        <div className="w-100 flex justify-end">
          <Button label="Save" danger />
        </div>
      </div>
    </div>
  )
}

ToggleSettings.propTypes = {
  settings: Props.array
}

export { SettingsTab }
