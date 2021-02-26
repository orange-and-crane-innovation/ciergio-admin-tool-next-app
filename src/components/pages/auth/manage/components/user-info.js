import P from 'prop-types'

import style from './user-info.module.css'

const Userinfo = ({ imgSrc, imgAlt, userName, userTitle }) => {
  return (
    <>
      <div className={style.userInfoWrapper}>
        <div className={style.imageWrap}>
          <img src={imgSrc} alt={imgAlt} />
        </div>

        <div className={style.userInfoContainer}>
          <div className={style.userInfoName} title={userName}>
            {userName}
          </div>
          <small className={style.userInfoTitle} title={userTitle}>
            {userTitle}
          </small>
        </div>
      </div>
    </>
  )
}

Userinfo.propTypes = {
  imgSrc: P.string,
  imgAlt: P.string,
  userName: P.string,
  userTitle: P.string,
  size: P.string
}

export default Userinfo
