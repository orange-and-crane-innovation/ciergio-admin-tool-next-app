import P from 'prop-types'

const Userinfo = ({ imgSrc, imgAlt, userName, userTitle, size }) => {
  const SIZES = {
    SM: 'small',
    MD: 'medium',
    LG: 'large',
    XL: 'x-large'
  }

  return (
    <>
      {/* Avatar */}
      <div className={`header-item-wrap avatar ${SIZES[size]}`}>
        <div className="image-wrap">
          <img src={imgSrc} alt={imgAlt} />
        </div>
      </div>
      {/* User info */}
      <div className={`header-item-wrap user-info ${SIZES[size]}`}>
        <div className="user-info-name" title={userName}>
          {userName}
        </div>
        <small className="user-info-title" title={userTitle}>
          {userTitle}
        </small>
      </div>
    </>
  )
}
Userinfo.defaultProps = {
  imgSrc: '../ciergio-icon.png',
  imgAlt: 'Logo',
  userName: 'Ciergio',
  userTitle: 'Develpment Team',
  size: 'LG'
}
Userinfo.propTypes = {
  imgSrc: P.string,
  imgAlt: P.string,
  userName: P.string,
  userTitle: P.string,
  size: P.string
}

export default Userinfo
