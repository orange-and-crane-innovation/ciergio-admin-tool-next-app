import React from 'react'
import P from 'prop-types'
import { FiMenu } from 'react-icons/fi'
import Link from 'next/link'
import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import CiergioLogoH from '@app/assets/svg/ciergio-logo-h.svg'

const Logo = ({ onToggle, isCollapsed }) => {
  return (
    <div className="logo truncate">
      <Link href="/">
        <>
          <CiergioLogo
            className={`-ml-2 mr-2 hidden ${
              isCollapsed ? 'md:block lg:block' : ''
            }`}
          />
          <CiergioLogoH className={`${isCollapsed ? 'md:hidden' : ''}`} />
        </>
      </Link>
      <button
        onClick={() => {
          onToggle(!isCollapsed)
        }}
        className="ml-auto mr-6 block md:hidden lg:hidden"
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
