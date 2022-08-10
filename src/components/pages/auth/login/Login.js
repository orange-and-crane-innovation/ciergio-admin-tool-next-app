import Link from 'next/link'
import P from 'prop-types'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import CiergioCircleIcon from '@app/assets/svg/ciergio-circle.svg'
import CiergioHomeIcon from '@app/assets/svg/ciergio-home.svg'
import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import CiergioMiniLogo from '@app/assets/svg/ciergio-mini.svg'
import CiergioPrayIcon from '@app/assets/svg/ciergio-pray.svg'
import Button from '@app/components/button'
import FormInput from '@app/components/forms/form-input'
import { yupResolver } from '@hookform/resolvers/yup'

import style from './Login.module.css'

const validationSchema = yup.object().shape({
  email: yup.string().email().label('Email Address').required(),
  password: yup.string().label('Password').required()
})

function Login({ onLoginSubmit, isSubmitting }) {
  // const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  // let systemName, systemLogo

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // switch (systemType) {
  //   case 'home':
  //     systemName = 'HOME'
  //     systemLogo = <CiergioHomeIcon className={style.PlatformIcon} />
  //     break

  //   case 'pray':
  //     systemName = 'PRAY'
  //     systemLogo = <CiergioPrayIcon className={style.PlatformIcon} />
  //     break

  //   case 'circle':
  //     systemName = 'CIRCLE'
  //     systemLogo = <CiergioCircleIcon className={style.PlatformIcon} />
  //     break
  // }

  return (
    <main className={style.Login}>
      <div className={style.LoginWrapper}>
        <div className={style.LogoContainer}>
          {<CiergioLogo className={style.Logo} />}
        </div>

        <div className={style.LoginCard}>
          {/* {systemName && (
            <div className={style.PlatformIconContainer}>
              <span className={style.PlatformSubContainer}>{systemLogo}</span>
              <span>{systemName}</span>
            </div>
          )} */}

          <form
            className={style.LoginForm}
            onSubmit={handleSubmit(onLoginSubmit)}
          >
            <h2>Login to your account</h2>

            <Controller
              name="email"
              control={control}
              render={({ name, value, onChange, ...props }) => (
                <FormInput
                  name={name}
                  value={value}
                  label="Email Address"
                  placeholder="Enter you email"
                  error={errors?.email?.message ?? null}
                  onChange={onChange}
                  inputProps={props}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ name, value, onChange, ...props }) => (
                <FormInput
                  type="password"
                  name={name}
                  value={value}
                  label="Password"
                  placeholder="Enter you password"
                  error={errors?.password?.message ?? null}
                  onChange={onChange}
                  inputProps={props}
                />
              )}
            />

            <br />

            <Button
              label="Login"
              type="submit"
              loading={isSubmitting}
              fluid
              primary
            />
          </form>
        </div>

        <div className={style.PageLink}>
          <Link href="/auth/forgot-password">I forgot my password</Link>
        </div>

        <div className={style.MiniFooter}>
          <span>Powered by </span>
          <CiergioMiniLogo />
        </div>
      </div>
    </main>
  )
}

Login.defaultProps = {
  isSubmitting: false
}

Login.propTypes = {
  onLoginSubmit: P.func.isRequired,
  isSubmitting: P.bool
}

export default Login
