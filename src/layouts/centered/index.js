import React from 'react'
import withGuest from '@app/utils/withGuest'

const Centered = ({children}) => (
  <div
    data-layout="centered"
    className="w-full h-screen flex items-center justify-center bg-gray-50">
    {children}
  </div>
)

export default withGuest(Centered)
