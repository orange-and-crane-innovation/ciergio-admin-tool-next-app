import React from 'react'
import P from 'prop-types'
import { FiBox, FiMenu } from 'react-icons/fi'
import Link from 'next/link'

const Logo = ({ onToggle, isCollapsed }) => {
  return (
    <div className="logo truncate">
      <Link href="/">
        <a className="flex flex-row items-center justify-start space-x-2">
          <FiBox size={28} />
          <span>{'Ciergio'}</span>
        </a>
      </Link>
      <button
        onClick={() => {
          onToggle(!isCollapsed)
        }}
        className="ml-auto mr-4 block lg:hidden"
      >
        <FiMenu size={20} />
      </button>
    </div>
  )
}

Logo.propTypes = {
  onToggle: P.func,
  isCollapsed: P.bool
}

export default Logo
