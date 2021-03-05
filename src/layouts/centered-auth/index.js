/* eslint-disable react/prop-types */
import React from 'react'
import Head from 'next/head'
import withAuth from '@app/utils/withAuth'

const Centered = ({ children }) => (
  <>
    <Head>
      <title>Ciergio</title>
    </Head>
    <div
      data-layout="centered"
      className="w-full h-screen flex justify-center bg-gray-50"
    >
      {children}
    </div>
  </>
)

export default withAuth(Centered)
