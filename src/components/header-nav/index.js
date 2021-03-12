import P from 'prop-types'
import { FiMenu } from 'react-icons/fi'
import Dropdown from './dropdown'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { IMAGES, ACCOUNT_TYPES } from '@app/constants'

export const GET_PROFILE = gql`
  query {
    getProfile {
      _id
      email
      avatar
      firstName
      lastName
      accounts {
        data {
          accountType
          active
        }
      }
    }
  }
`

const Navbar = ({ onToggle, isCollapsed }) => {
  const { data } = useQuery(GET_PROFILE, {
    fetchPolicy: 'cache-only'
  })
  const profile = data ? data.getProfile : {}
  const account =
    profile.accounts.data.length > 0
      ? profile.accounts.data.filter(account => account.active === true)
      : []
  return (
    <div className="navbar navbar-1">
      <div className="navbar-inner">
        <button
          onClick={() => {
            onToggle(!isCollapsed)
          }}
          className="toggle-btn"
        >
          <FiMenu size={20} />
        </button>

        <span className="ml-auto"></span>

        <div
          className={`header-item-wrap user-info small text-md font-body text-right`}
        >
          <div className="text-neutral-500">Welcome,</div>
          <div className="text-black">
            {`${profile?.firstName ?? 'Guest'} ${profile?.lastName ?? ''}`}
          </div>
        </div>
        <div className={`header-item-wrap avatar small`}>
          <div className="image-wrap">
            <img
              src={
                profile?.avatar
                  ? profile?.avatar
                  : account[0]?.accountType === ACCOUNT_TYPES.SUP
                  ? IMAGES.ADMIN_AVATAR
                  : account[0]?.accountType === ACCOUNT_TYPES.COMPYAD
                  ? IMAGES.COMPANY_AVATAR
                  : account[0]?.accountType === ACCOUNT_TYPES.COMPXAD
                  ? IMAGES.COMPLEX_AVATAR
                  : IMAGES.DEFAULT_AVATAR
              }
              alt={'Logo'}
            />
          </div>
        </div>

        {/* User dropdown */}
        <div className="header-item-wrap user-dropdown">
          <Dropdown />
        </div>
      </div>
    </div>
  )
}

Navbar.propTypes = {
  onToggle: P.func,
  isCollapsed: P.bool
}

export default Navbar
