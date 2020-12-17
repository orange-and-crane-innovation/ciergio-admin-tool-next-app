import Link from 'next/link'
import P from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import CiergioChurchIcon from '@app/assets/svg/ciergio-church-icon.svg'
import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import style from './Login.module.css'

const validationSchema = yup.object().shape({
  email: yup.string().email().label('Email Address').required(),
  password: yup.string().label('Password').required()
})

function Login({ onLoginSubmit, isSubmitting }) {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

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

            <Button
              label="Login"
              type="submit"
              loading={isSubmitting}
              fluid
              primary
            />
          </form>
        </div>
        <Link href="/auth/forgot-password">I forgot my password</Link>
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
