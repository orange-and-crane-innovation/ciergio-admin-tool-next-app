import React, { useState, useEffect, useRef } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import Userinfo from './user-info'
import MenuItem from './menu-item'

const Dropdown = () => {
  const [hidden, setHidden] = useState(true)

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        hidden ||
        buttonRef.current.contains(event.target) ||
        dropdownRef.current.contains(event.target)
      ) {
        return false
      }
      setHidden(!hidden)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [hidden, dropdownRef, buttonRef])

  const handleDropdownClick = () => {
    setHidden(!hidden)
  }

  return (
    <>
      <div
        ref={dropdownRef}
        className={`dropdown absolute top-0 right-0 mt-20 ${
          hidden ? '' : 'open'
        }`}
      >
        <div className="dropdown-content">
          <div className="flex flex-row flex-wrap">
            <div className="dropdown-section">
              <div className="userinfo-wrap">
                <Userinfo
                  imgSrc={'../ciergio-icon.png'}
                  imgAlt={'Logo'}
                  userName={'Jose Lapez'}
                  userTitle={'admin@orangeandcrane.com'}
                />
              </div>
            </div>

            <div className="dropdown-section">
              <hr />
            </div>

            <div className="dropdown-section">
              <div className="section-title">My Account</div>
              <MenuItem
                url={'/dashboard'}
                icon={'ciergio-employees'}
                title={'My Profile'}
              />
              <MenuItem
                url={'/dashboard'}
                icon={'ciergio-settings'}
                title={'Preferences'}
              />
            </div>

            <div className="dropdown-section">
              <hr />
            </div>

            <div className="dropdown-section">
              <div className="userinfo-wrap">
                <Userinfo
                  imgSrc={'../ciergio-icon.png'}
                  imgAlt={'Logo'}
                  userName={'Jose Lapez'}
                  userTitle={'admin@orangeandcrane.com'}
                />
              </div>
              <div className="section-title">Switch Accounts</div>
              {/* use map to loop on existing account */}
              <div className="userinfo-wrap button">
                <Userinfo
                  imgSrc={'../ciergio-icon.png'}
                  imgAlt={'Logo'}
                  userName={'Jose Lapez'}
                  userTitle={'admin@orangeandcrane.com'}
                  size={'SM'}
                />
              </div>
            </div>

            <div className="dropdown-section">
              <hr />
            </div>

            <div className="dropdown-section">
              <MenuItem
                url={'/dashboard'}
                icon={'ciergio-teams'}
                title={'Manage Accounts'}
              />
              <MenuItem
                icon={'ciergio-upload'}
                iconClass={'arrow'}
                onClick={() => {
                  console.log('Trigger logout')
                }}
                title={'Log out'}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        ref={buttonRef}
        onClick={handleDropdownClick}
        className="dropdown-trigger"
      >
        <FiChevronRight className="arrow text-xl" />
      </button>
    </>
  )
}

export default Dropdown
