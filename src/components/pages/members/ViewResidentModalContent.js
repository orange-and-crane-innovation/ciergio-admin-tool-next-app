import React from 'react'
import P from 'prop-types'
import { friendlyDateTimeFormat } from '@app/utils/date'

function ViewResidentModalContent({ resident }) {
  const groups = resident?.groups
    ?.map(i => i.name)
    .toString()
    .replaceAll(',', ', ')

  return (
    <div className="p-4 flex flex-col">
      <div className="w-full mb-8">
        <div className="w-24 h-24 rounded-full overflow-auto">
          <img
            className="h-full w-full object-contain object-center"
            src={
              resident?.avatar ||
              `https://ui-avatars.com/api/?name=${resident?.first_name}+${resident?.last_name}&rounded=true&size=44`
            }
            alt="user-avatar"
          />
        </div>
      </div>
      <div className="w-full flex justify-start">
        <InfoBlock label="First Name" text={resident?.first_name} />
        <InfoBlock label="Last Name" text={resident?.last_name} />
      </div>
      <div className="w-full flex justify-start">
        <InfoBlock
          label="Birthday"
          text={
            resident?.birthday
              ? friendlyDateTimeFormat(resident?.birthday, 'LL')
              : '--'
          }
        />
        <InfoBlock
          label="Gender"
          text={resident?.gender || '--'}
          transformText="capitalize"
        />
      </div>

      <div className="w-full flex justify-start">
        <InfoBlock label="Email Address" text={resident?.email} />
      </div>

      <div className="w-full flex justify-start">
        <InfoBlock label="Group(s)" text={groups} />
      </div>

      <br />

      <div className="w-full flex justify-start">
        <InfoBlock label="Date Registered" text={resident?.date_reg} />
        <InfoBlock label="Device Used" text={resident?.device_used} />
      </div>
      <div className="w-full flex justify-start">
        <InfoBlock label="Last Activity" text={resident?.last_active} />
      </div>
    </div>
  )
}

function InfoBlock({ label, text, transformText }) {
  return (
    <div className="flex flex-col mb-4 w-1/2 justify-self-start">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <p className={`text-base ${transformText}`}>{text}</p>
    </div>
  )
}

InfoBlock.propTypes = {
  label: P.string,
  text: P.string,
  transformText: P.string
}

ViewResidentModalContent.propTypes = {
  resident: P.object
}

export default ViewResidentModalContent
