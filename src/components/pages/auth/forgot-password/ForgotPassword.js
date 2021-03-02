import { useState } from 'react'
import Link from 'next/link'
import P from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import CiergioMiniLogo from '@app/assets/svg/ciergio-mini.svg'
import style from './ForgotPassword.module.css'

const validationSchema = yup.object().shape({
  email: yup.string().email().label('Email Address').required()
})

function ForgotPassword({ onSubmit, isSubmitting }) {
  const [isDisabled, setIsDisabled] = useState(true)

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: ''
    }
  })

  const onEmailChange = e => {
    if (e.target.value !== '') {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }

  return (
    <main className={style.ForgotPassword}>
      <div className={style.ForgotPasswordWrapper}>
        <div className={style.LogoContainer}>
          <CiergioLogo className={style.Logo} />
        </div>

        <div className={style.ForgotPasswordCard}>
          <form
            className={style.ForgotPasswordForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2>Forgot Password</h2>
            <p>Enter your email below to reset your password.</p>

            <Controller
              name="email"
              control={control}
              render={({ name, value, onChange, ...props }) => (
                <FormInput
                  name={name}
                  value={value}
                  label="Email"
                  placeholder="Enter you email"
                  error={errors?.email?.message ?? null}
                  onChange={e => {
                    onChange(e)
                    onEmailChange(e)
                  }}
                  inputProps={props}
                />
              )}
            />

            <br />

            <Button
              label="Submit"
              type="submit"
              loading={isSubmitting}
              disabled={isDisabled}
              fluid
              primary
            />
          </form>
        </div>

        <div className={style.PageLink}>
          <Link href="/auth/login">I want to login instead</Link>
        </div>

        <div className={style.MiniFooter}>
          <span>Powered by </span>
          <CiergioMiniLogo />
        </div>
      </div>
    </main>
  )
}

ForgotPassword.defaultProps = {
  isSubmitting: false
}

ForgotPassword.propTypes = {
  onSubmit: P.func.isRequired,
  isSubmitting: P.bool
}

export default ForgotPassword
