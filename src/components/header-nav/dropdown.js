/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { FiChevronRight } from 'react-icons/fi'
import Userinfo from './user-info'
import MenuItem from './menu-item'

import { IMAGES, ACCOUNT_TYPES } from '@app/constants'
import showToast from '@app/utils/toast'
import getAccountTypeName from '@app/utils/getAccountTypeName'

const SWITCH_ACCOUNT_MUTATION = gql`
  mutation switchAccount($data: InputSwitchAccount) {
    switchAccount(data: $data) {
      processId
      message
      slave
    }
  }
`

const Dropdown = () => {
  const router = useRouter()
  const [hidden, setHidden] = useState(true)
  const profile = JSON.parse(localStorage.getItem('profile'))
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)
  const activeAccount = profile?.accounts?.data[0]

  const [switchAccount, { loading, data, called, error }] = useMutation(
    SWITCH_ACCOUNT_MUTATION,
    { onError: _e => {} }
  )

  useEffect(() => {
    if (loading) {
      showToast('info', 'Switching Account...')
    } else if (!loading) {
      if (error) {
        errorHandler(error)
      }
      if (called && data) {
        localStorage.setItem('keep', data?.switchAccount?.slave)
        const timer = setTimeout(() => {
          router.reload()
          clearInterval(timer)
        }, 1000)
      }
    }
  }, [loading, called, data, error])

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

  const onSwitchAccount = id => {
    switchAccount({
      variables: {
        data: {
          accountId: id
        }
      }
    })
  }

  const onLogout = () => {
    localStorage.removeItem('keep')
    localStorage.removeItem('profile')

    const timer = setTimeout(() => {
      router.push('/auth/login')
      clearInterval(timer)
    }, 500)
  }

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError, message } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError?.result?.errors) {
        showToast('danger', errors?.networkError?.result?.errors[0]?.message)
      }

      if (
        message &&
        graphQLErrors?.length === 0 &&
        !networkError?.result?.errors
      ) {
        showToast('danger', message)
      }
    }
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
                  imgSrc={
                    profile?.avatar
                      ? profile?.avatar
                      : activeAccount.accountType === ACCOUNT_TYPES.SUP
                      ? IMAGES.ADMIN_AVATAR
                      : activeAccount.accountType === ACCOUNT_TYPES.COMPYAD
                      ? IMAGES.COMPANY_AVATAR
                      : activeAccount.accountType === ACCOUNT_TYPES.COMPXAD
                      ? IMAGES.COMPLEX_AVATAR
                      : IMAGES.DEFAULT_AVATAR
                  }
                  imgAlt={'Logo'}
                  userName={`${profile.firstName} ${profile.lastName}`}
                  userTitle={profile.email}
                />
              </div>
            </div>

            <div className="dropdown-section">
              <hr />
            </div>

            <div className="dropdown-section">
              <div className="section-title">My Account</div>
              <MenuItem
                url={'/account/profile'}
                icon={'ciergio-user'}
                title={'My Profile'}
              />
              <MenuItem
                url={'/dashboard'}
                icon={'ciergio-gear'}
                title={'Preferences'}
              />
            </div>

            <div className="dropdown-section">
              <hr />
            </div>

            <div className="dropdown-section">
              <div className="userinfo-wrap">
                <Userinfo
                  size="XL"
                  imgSrc={
                    activeAccount?.accountType === ACCOUNT_TYPES.COMPYAD.value
                      ? activeAccount?.company?.avatar ?? IMAGES.PROPERTY_AVATAR
                      : activeAccount?.accountType ===
                        ACCOUNT_TYPES.COMPXAD.value
                      ? activeAccount?.complex?.avatar ?? IMAGES.PROPERTY_AVATAR
                      : activeAccount?.accountType ===
                        ACCOUNT_TYPES.BUIGAD.value
                      ? activeAccount?.building?.avatar ??
                        IMAGES.PROPERTY_AVATAR
                      : activeAccount?.company?.avatar ?? IMAGES.PROPERTY_AVATAR
                  }
                  imgAlt={'Logo'}
                  userName={
                    activeAccount?.accountType === ACCOUNT_TYPES.COMPYAD.value
                      ? activeAccount?.company?.name
                      : activeAccount?.accountType ===
                        ACCOUNT_TYPES.COMPXAD.value
                      ? activeAccount?.complex?.name
                      : activeAccount?.accountType ===
                        ACCOUNT_TYPES.BUIGAD.value
                      ? activeAccount?.building?.name
                      : activeAccount?.company?.name
                  }
                  userTitle={getAccountTypeName(activeAccount?.accountType)}
                />
              </div>

              {profile?.accounts?.data?.filter(item =>
                [
                  ACCOUNT_TYPES.SUP.value,
                  ACCOUNT_TYPES.COMPYAD.value,
                  ACCOUNT_TYPES.COMPXAD.value,
                  ACCOUNT_TYPES.BUIGAD.value,
                  ACCOUNT_TYPES.RECEP.value
                ].includes(item?.accountType)
              ).length > 1 && (
                <>
                  <div className="section-title">Switch Accounts</div>
                  {profile?.accounts?.data?.map((item, index) => {
                    return (
                      index !== 0 &&
                      [
                        ACCOUNT_TYPES.SUP.value,
                        ACCOUNT_TYPES.COMPYAD.value,
                        ACCOUNT_TYPES.COMPXAD.value,
                        ACCOUNT_TYPES.BUIGAD.value,
                        ACCOUNT_TYPES.RECEP.value
                      ].includes(item?.accountType) && (
                        <div
                          key={index}
                          className="userinfo-wrap button"
                          onClick={() => onSwitchAccount(item?._id)}
                        >
                          <Userinfo
                            imgSrc={
                              item?.accountType === ACCOUNT_TYPES.COMPYAD.value
                                ? item?.company?.avatar ??
                                  IMAGES.PROPERTY_AVATAR
                                : item?.accountType ===
                                  ACCOUNT_TYPES.COMPXAD.value
                                ? item?.complex?.avatar ??
                                  IMAGES.PROPERTY_AVATAR
                                : item?.accountType ===
                                  ACCOUNT_TYPES.BUIGAD.value
                                ? item?.building?.avatar ??
                                  IMAGES.PROPERTY_AVATAR
                                : item?.company?.avatar ??
                                  IMAGES.PROPERTY_AVATAR
                            }
                            imgAlt={'Logo'}
                            userName={
                              item?.accountType === ACCOUNT_TYPES.COMPYAD.value
                                ? item?.company?.name
                                : item?.accountType ===
                                  ACCOUNT_TYPES.COMPXAD.value
                                ? item?.complex?.name
                                : item?.accountType ===
                                  ACCOUNT_TYPES.BUIGAD.value
                                ? item?.building?.name
                                : item?.company?.name
                            }
                            userTitle={getAccountTypeName(item?.accountType)}
                            size={'SM'}
                          />
                        </div>
                      )
                    )
                  })}
                </>
              )}
            </div>

            <div className="dropdown-section">
              <hr />
            </div>

            <div className="dropdown-section">
              <MenuItem
                url={'/auth/manage'}
                icon={'ciergio-user-group'}
                title={'Manage Accounts'}
              />
              <MenuItem
                icon={'ciergio-upload'}
                iconClass={'arrow'}
                onClick={() => onLogout()}
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
