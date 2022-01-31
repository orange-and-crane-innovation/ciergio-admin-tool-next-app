import React, { useState, useEffect } from 'react'
import Toggle from '@app/components/toggle'
import styles from './settings.module.css'
import Select from '@app/components/forms/form-select'
import Button from '@app/components/button'
import Input from '@app/components/forms/form-input'
import Props from 'prop-types'
import { MyDuesExtraComponent, DonationsContent } from './components'
import { useQuery, useMutation } from '@apollo/client'
import { getCompanySettings, updateCompanySettings } from '../_query'

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

const RenderExtraComponent = ({ type, isToggle }) => {
  // eslint-disable-next-line react/prop-types
  const Card = ({ children }) => {
    return (
      <div className="py-7 px-6 mb-5 bg-white border-black">{children}</div>
    )
  }
  // eslint-disable-next-line react/prop-types
  const InputContent = ({ label, ...props }) => {
    return (
      <div className="w-1/4">
        <Input label={label} labelClassName="font-bold" {...props} />
      </div>
    )
  }

  if (isToggle) {
    switch (type) {
      case 'myDues':
        return (
          <Card>
            <MyDuesExtraComponent />
          </Card>
        )
      case 'directory':
        return (
          <Card>
            <InputContent label="Directory Limit" />
          </Card>
        )
      case 'forms':
        return (
          <Card>
            <InputContent label="Forms Limit" />
          </Card>
        )
      case 'contactPage':
        return (
          <Card>
            <InputContent label="Contact Entry Limit" />
          </Card>
        )
      case 'donations':
        return (
          <Card>
            <DonationsContent />
          </Card>
        )
      default:
        return null
    }
  }
  return null
}

const ToggleSettings = ({ settings, setToggleData }) => {
  return (
    <div className="flex flex-col">
      {settings &&
        settings.map((setting, index) => {
          return (
            <div
              key={index}
              className="flex my-5 flex-col border-neutral-400 border-b"
            >
              <div className={styles.withToggle}>
                <p className="font-bold text-lg">{setting.label}</p>
                <Toggle
                  onChange={() => {
                    setToggleData(setting)
                  }}
                  defaultChecked={setting.toggle}
                />
              </div>
              <RenderExtraComponent
                type={setting.id}
                isToggle={setting.toggle}
              />
            </div>
          )
        })}
    </div>
  )
}

const SettingsTab = ({ user }) => {
  const companyID = user?.accounts?.data[0]?.company?._id
  const [toggleData, setToggleData] = useState([
    {
      label: 'Bulletin Board',
      id: 'bulletinBoard',
      toggle: false
    },
    {
      label: 'QR Code',
      id: 'qrCode',
      toggle: false
    },
    {
      label: 'Messages',
      id: 'messages',
      toggle: false
    },
    {
      label: 'Guest and Delivery',
      id: 'guestAndDelivery',
      toggle: false
    },
    {
      label: 'Maintenance & Repairs',
      id: 'maintenance',
      toggle: false
    },
    {
      label: 'My Dues',
      id: 'myDues',
      toggle: false
    },
    {
      label: 'Notifications',
      id: 'notifications',
      toggle: false
    },
    {
      label: 'Directory',
      id: 'directory',
      toggle: false
    },
    {
      label: 'Forms',
      id: 'forms',
      toggle: false
    },
    {
      label: 'Contact Page',
      id: 'contactPage',
      toggle: false
    },
    {
      label: 'Donations',
      id: 'donations',
      toggle: false
    },
    {
      label: 'Community Board',
      id: 'communityBoard',
      toggle: false
    }
  ])

  const { loading, data, error } = useQuery(getCompanySettings, {
    variables: {
      where: {
        companyId: companyID
      }
    }
  })

  // still cant integrate this since im still coordinating with chris
  const [updateSettings, { loading: loadingUpdate }] = useMutation(
    updateCompanySettings
  )

  useEffect(() => {
    if (!loading && !error) {
      const { subscriptionModules } = data?.getCompanySettings
      const temp = toggleData.map(toggleSetting => {
        if (subscriptionModules[toggleSetting.id]) {
          return {
            ...toggleSetting,
            toggle: subscriptionModules[toggleSetting.id]?.enable
          }
        }
        return toggleSetting
      })
      setToggleData(temp)
    }
  }, [loading, data, error])

  const handleToggleChange = data => {
    const newData = toggleData.map(toggle => {
      if (toggle.id === data.id) {
        return { ...data, toggle: !data.toggle }
      }
      return toggle
    })

    setToggleData(newData)
  }

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
        <ToggleSettings
          settings={toggleData}
          setToggleData={handleToggleChange}
        />
        <div className="w-100 flex justify-end">
          <Button label="Save" danger />
        </div>
      </div>
    </div>
  )
}

RenderExtraComponent.propTypes = {
  type: Props.string.isRequired,
  isToggle: Props.bool.isRequired
}

ToggleSettings.propTypes = {
  settings: Props.array.isRequired,
  setToggleData: Props.func.isRequired
}

SettingsTab.propTypes = {
  user: Props.object
}

export { SettingsTab }
