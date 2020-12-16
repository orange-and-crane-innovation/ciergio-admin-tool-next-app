import React from 'react'
import Link from 'next/link'

const ErrorPage = () => {
  return (
    <div className="flex flex-col w-full max-w-xl text-center">
      <img
        className="object-contain w-auto h-64 mb-8"
        src="/illustration.svg"
        alt="svg"
      />
      <h1 className="text-6xl text-blue-gray-700 mb-4">404</h1>

      <div className="mb-8 text-center text-grey-900">
        We&apos;re sorry. The page you requested could not be found. Please go
        back to the homepage or contact us
      </div>
      <div className="flex w-full">
        <Link href="/">
          <a className="btn btn-lg btn-rounded btn-block bg-blue-gray-700 hover:bg-blue-gray-900 text-white">
            Go back
          </a>
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage
