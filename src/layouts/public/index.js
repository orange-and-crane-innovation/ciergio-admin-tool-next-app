/* eslint-disable react/prop-types */
import React from 'react'
import Head from 'next/head'

const Public = ({ children }) => (
  <>
    <Head>
      <title>Ciergio</title>
    </Head>
    <div
      data-layout="centered"
      className="w-full h-screen flex items-start justify-center bg-gray-50"
    >
      {children}
    </div>
  </>
)

export default Public
