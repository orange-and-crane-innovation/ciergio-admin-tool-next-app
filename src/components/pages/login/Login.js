import Link from 'next/link'
import P from 'prop-types'
import { useForm, Controller } from 'react-hook-form'

import CiergioChurchIcon from '@app/assets/svg/ciergio-church-icon.svg'
import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import style from './Login.module.css'

function Login({ onLoginSubmit }) {
  const { handleSubmit, control } = useForm()

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

          <form
            className={style.LoginForm}
            onSubmit={handleSubmit(onLoginSubmit)}
          >
            <h2>Login to your account</h2>

            <label htmlFor="email">
              <span>Name</span>
              <Controller
                name="email"
                id="email"
                control={control}
                defaultValue=""
                render={({ value, onChange }) => (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your email"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </label>

            <label htmlFor="password">
              <span>Password</span>
              <Controller
                name="password"
                id="password"
                control={control}
                defaultValue=""
                render={({ value, onChange }) => (
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </label>

            <button type="submit" className="btn btn-primary btn-fluid">
              <span>Login</span>
            </button>
          </form>
        </div>
        <Link href="/auth/forgot-password">I forgot my password</Link>
      </div>
    </main>
  )
}

Login.propTypes = {
  onLoginSubmit: P.func.isRequired
}

export default Login
