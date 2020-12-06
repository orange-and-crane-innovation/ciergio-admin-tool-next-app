import Link from 'next/link'

import CiergioChurchIcon from '@app/assets/svg/ciergio-church-icon.svg'
import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import style from './Login.module.css'

function Login() {
  return (
    <main className={style.Login}>
      <div className={style.LoginWrapper}>
        <div className={style.LogoContainer}>
          <CiergioLogo className={style.Logo} />
        </div>

        <div className={style.LoginCard}>
          <div className={style.PlatformIconContainer}>
            <CiergioChurchIcon className={style.PlatformIcon} />
            <span>Church</span>
          </div>

          <form className={style.LoginForm}>
            <h2>Login to your account</h2>

            <label>
              <span>Name</span>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your email"
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
              />
            </label>

            <button type="button" className="btn btn-primary btn-fluid">
              <span>Login</span>
            </button>
          </form>
        </div>
        <Link href="/auth/forgot-password">I forgot my password</Link>
      </div>
    </main>
  )
}

export default Login
