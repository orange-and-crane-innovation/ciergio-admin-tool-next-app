/* eslint-disable react/prop-types */
import React from 'react'
import Head from 'next/head'
import withGuest from '@app/utils/withGuest'

const Centered = ({ children }) => (
  <>
    <Head>
      <title>Ciergio</title>
    </Head>
    <div
      data-layout="centered"
      className="w-full h-screen flex items-center justify-center bg-gray-50"
    >
      {children}
    </div>
  </>
)

export default withGuest(Centered)
