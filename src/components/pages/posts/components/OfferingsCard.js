import React from 'react'

import OfferingsIcon from '@app/assets/svg/offerings-logo.svg'

const OfferingsCard = () => {
  return (
    <div className="ml-6">
      <p className="mb-2 font-semibold">Preview:</p>
      <div className="p-4 bg-info-600 text-white rounded-md flex items-center max-w-sm">
        <OfferingsIcon />
        <span className="mx-4">
          Every little bit helps us do God’s work!
          <br />
          <strong>Give an Offering</strong>
        </span>
      </div>
    </div>
  )
}

export default OfferingsCard
