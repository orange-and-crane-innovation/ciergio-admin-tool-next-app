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
import showToast from '@app/utils/toast'
import { dequal } from 'dequal'

const KEEPACTIVITYLOGS = [
  {
    label: 'Never',
    value: 'Never'
  },
  {
    label: '30 Days',
    value: 'Thirty_Days'
  },
  {
    label: 'Forever',
    value: 'Forever'
  }
]

const TOGGLESETTINGS = [
  {
    label: 'Allow public Posts and View',
    id: 'allowPublicPosts',
    toggle: false
  },
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
    label: 'Contact Us',
    id: 'contactPage',
    toggle: false
  },
  {
    label: 'Donations',
    id: 'donations',
    toggle: false
  },
  {
    label: 'Daily Readings',
    id: 'dailyReading',
    toggle: false
  },
  {
    label: 'Prayer Request',
    id: 'prayerRequests',
    toggle: false
  },
  {
    label: 'Community Board',
    id: 'communityBoard',
    toggle: false
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
                  toggle={setting.toggle}
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
  const [originalToggle, setOriginalToggle] = useState([])
  const [toggleData, setToggleData] = useState(TOGGLESETTINGS)
  const [keepLog, setKeepLog] = useState(null)
  const [deleteLog, setDeleteLog] = useState(null)

  const { loading, data, error } = useQuery(getCompanySettings, {
    variables: {
      where: {
        companyId: companyID
      }
    }
  })

  const [
    updateSettings,
    { loading: loadingUpdate, error: updateError, data: dataUpdate }
  ] = useMutation(updateCompanySettings)

  useEffect(() => {
    if (updateError) {
      showToast(
        'error',
        'Cant save settings, please try again',
        null,
        null,
        1000
      )
    }

    if (loadingUpdate && !data) {
      showToast('info', 'Saving Settings...', null, null, 1000)
    }

    if (!loading && !error && dataUpdate) {
      showToast('success', 'Settings Saved', null, null, 1000)
    }
  }, [loadingUpdate, updateError])

  useEffect(() => {
    if (!loading && !error) {
      const {
        keepActivityLogs,
        keepDeletedPosts,
        subscriptionModules,
        allowPublicPosts
      } = data?.getCompanySettings
      const temp = toggleData.map(toggleSetting => {
        const toggle = subscriptionModules[toggleSetting.id]
        const keys = toggle ? Object.keys(toggle) : []

        if (toggle) {
          return {
            ...toggleSetting,
            toggle: toggle?.enable,
            ...(toggle?.displayName
              ? { label: toggle?.displayName }
              : { label: toggleSetting?.label }),
            canToggle: keys.indexOf('enable') > 0
          }
        }
        return toggleSetting
      })
      const keepValue = KEEPACTIVITYLOGS.find(
        keep => keep.value === keepActivityLogs
      )
      setKeepLog(keepValue)

      const deletedValue = KEEPACTIVITYLOGS.find(
        keep => keep.value === keepDeletedPosts
      )
      setDeleteLog(deletedValue)

      temp[0] = { ...temp[0], toggle: allowPublicPosts }
      setToggleData(temp)
      setOriginalToggle(temp)
    }
  }, [loading, data, error])

  const handleToggleChange = data => {
    if (data) {
      if (data.canToggle) {
        const newData = toggleData.map(toggle => {
          if (toggle.id === data.id) {
            return { ...data, toggle: !data.toggle }
          }
          return toggle
        })

        setToggleData(newData)
      } else {
        const TOGGLE_MESSAGE = `The ${
          data?.label || 'toggle'
        } field is read only`
        showToast('warning', TOGGLE_MESSAGE, null, null, 1000)
      }
    }
  }

  const handleSelectOnChange = (data, type) => {
    if (type === 'keep') {
      setKeepLog(data)
    } else {
      setDeleteLog(data)
    }
  }

  const saveSettings = () => {
    const temp = toggleData
    const subscriptionModules = temp.reduce((acc, toggle) => {
      const tempAcc = acc
      if (toggle.id !== 'allowPublicPosts') {
        tempAcc[toggle.id] = {
          displayName: toggle.label,
          ...(toggle?.canToggle && { enable: toggle?.toggle })
        }
      }
      return tempAcc
    }, {})

    const data = {
      allowPublicPosts: toggleData[0].toggle,
      keepActivityLogs: keepLog?.value || '',
      keepDeletedPosts: deleteLog?.value || '',
      subscriptionModules: subscriptionModules
    }

    updateSettings({
      variables: {
        data: data,
        companyId: companyID
      }
    })
  }

  return (
    <div className="my-10">
      <div className="w-5/6">
        <h1 className="font-bold text-xl">General</h1>
        <div className={styles.withToggle}>
          <div className="mr-5">
            <p className="font-bold text-lg">{toggleData[0]?.label}</p>
            <p>
              Allow this company and every property under them to post content
              in some features publicly (ex. Bulletin Board. ) Sign in on the
              mobile app isnt`t required when this is turned on.
            </p>
          </div>
          <Toggle
            onChange={() => {
              handleToggleChange(toggleData[0])
            }}
            toggle={toggleData[0]?.toggle}
          />
        </div>
        <div className="pb-5 border-neutral-400 border-b">
          <div className="mr-10">
            <p className="font-bold text-lg">Keep Activity History</p>
            <p>
              How long Ciergio keeps the logs available for users and properties
            </p>
          </div>
          <div className="w-1/4">
            <Select
              options={KEEPACTIVITYLOGS}
              onChange={data => handleSelectOnChange(data, 'keep')}
              value={keepLog}
            />
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
            <Select
              options={KEEPACTIVITYLOGS}
              onChange={data => handleSelectOnChange(data, 'delete')}
              value={deleteLog}
            />
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
          settings={toggleData.slice(1)}
          setToggleData={handleToggleChange}
        />
        <div className="w-100 flex justify-end">
          <Button
            disabled={
              dequal(originalToggle, toggleData) && !keepLog && !deleteLog
            }
            label="Save"
            danger
            onClick={saveSettings}
          />
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
