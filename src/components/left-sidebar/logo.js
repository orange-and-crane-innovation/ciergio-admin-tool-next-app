import React from 'react'
import {FiBox, FiMenu} from 'react-icons/fi'
import Link from 'next/link'

const Logo = () => {
  return (
    <div className="logo truncate">
      <Link href="/">
        <a className="flex flex-row items-center justify-start space-x-2">
          <FiBox size={28} />
          <span>{'Ciergio'}</span>
        </a>
      </Link>
      <button
        onClick={() =>
          console.log('HELLO')
        }
        className="ml-auto mr-4 block lg:hidden">
        <FiMenu size={20} />
      </button>
    </div>
  )
}

export default Logo
