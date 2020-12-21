import P from 'prop-types'
import { FiMenu } from 'react-icons/fi'
import Userinfo from './user-info'
import Dropdown from './dropdown'

const Navbar = ({ onToggle, isCollapsed }) => {
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

        <Userinfo
          imgSrc={'../ciergio-icon.png'}
          imgAlt={'Logo'}
          userName={'Orange and Crane Innovations Inc.'}
          userTitle={'Orange and Crane Innovations Inc.'}
        />
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
