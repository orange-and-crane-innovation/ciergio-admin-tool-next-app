import P from 'prop-types'
import Link from 'next/link'

const MenuItem = ({ url, icon, iconClass, title, onClick }) => {
  if (url) {
    return (
      <div className="dropdown-item">
        <Link href={url}>
          <a className="link">
            {icon && <i className={`icon ${icon} ${iconClass}`}></i>}
            <span className="title pl-3">{title}</span>
          </a>
        </Link>
      </div>
    )
  }

  return (
    <div className="dropdown-item">
      <button className="button" onClick={onClick}>
        {icon && <i className={`icon ${icon} ${iconClass}`}></i>}
        <span className="title pl-3">{title}</span>
      </button>
    </div>
  )
}
MenuItem.defaultProps = {
  url: undefined,
  icon: 'ciergio-user',
  name: 'My Profile',
  iconClass: '',
  onClick: () => {
    console.log('TEST')
  }
}
MenuItem.propTypes = {
  url: P.string,
  icon: P.string,
  iconClass: P.string,
  title: P.string,
  onClick: P.func
}

export default MenuItem
