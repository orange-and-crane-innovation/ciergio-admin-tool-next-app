import React from 'react'
import P from 'prop-types'

import UploaderImage from '@app/components/uploader/image'

function ViewResidentModalContent({ resident }) {
  return (
    <div className="p-4 flex flex-col">
      <div className="w-full">
        <UploaderImage />
      </div>
      <div className="w-full flex justify-start">
        <InfoBlock label="First Name" text={resident?.first_name} />
        <InfoBlock label="Last Name" text={resident?.last_name} />
      </div>
      <div className="w-full flex justify-start">
        <InfoBlock label="Birthday" text={resident?.birthday} />
        <InfoBlock
          label="Gender"
          text={resident?.gender}
          transformText="capitalize"
        />
      </div>
      <div className="w-full flex justify-start">
        <InfoBlock label="Email Address" text={resident?.email} />
      </div>
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
