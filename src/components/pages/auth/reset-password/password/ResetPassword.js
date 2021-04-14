import React, { useState, useEffect } from 'react'
import P from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PasswordStrengthBar from 'react-password-strength-bar'

import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import CiergioMiniLogo from '@app/assets/svg/ciergio-mini.svg'
import style from './ResetPassword.module.css'

const validationSchema = yup.object().shape({
  newPassword: yup
    .string()
    .label('Password')
    .required()
    .test(
      'len',
      'Must be up to 16 characters only',
      val => val.toString().length <= 16
    )
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
    )
})

function ResetPassword({ onSubmit, isSubmitting }) {
  const [password, setPassword] = useState()
  const resetToken = localStorage.getItem('reset_token')

  const { handleSubmit, control, errors, register, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      token: resetToken,
      newPassword: ''
    }
  })

  useEffect(() => {
    register({ name: 'token' })
    setValue('id', resetToken)
  }, [])

  return (
    <main className={style.ResetPassword}>
      <div className={style.ResetPasswordWrapper}>
        <div className={style.LogoContainer}>
          <CiergioLogo className={style.Logo} />
        </div>

        <div className={style.ResetPasswordCard}>
          {resetToken ? (
            <form
              className={style.ResetPasswordForm}
              onSubmit={handleSubmit(onSubmit)}
            >
              <h2>Create a password {resetToken}</h2>
              <p>
                For security purposes, your password must be between 8 to 16
                characters long, including at least a number (0-9), a lowercase
                letter (a-z), an uppercase letter (A-Z) and a special character.
              </p>

              <Controller
                name="newPassword"
                control={control}
                render={({ name, value, onChange, ...props }) => (
                  <>
                    <FormInput
                      type="password"
                      name={name}
                      value={value}
                      maxLength={16}
                      label="New Password"
                      placeholder="Create you password"
                      error={errors?.newPassword?.message ?? null}
                      onChange={e => {
                        onChange(e)
                        setPassword(e.target.value)
                      }}
                      inputProps={props}
                    />
                    {value && <PasswordStrengthBar password={password} />}
                  </>
                )}
              />

              <br />

              <Button
                label="Submit"
                type="submit"
                loading={isSubmitting}
                fluid
                primary
              />
            </form>
          ) : (
            <p className={style.PageError}>The code is invalid/not found.</p>
          )}
        </div>

        <div className={style.MiniFooter}>
          <span>Powered by </span>
          <CiergioMiniLogo />
        </div>
      </div>
    </main>
  )
}

ResetPassword.defaultProps = {
  isSubmitting: false
}

ResetPassword.propTypes = {
  onSubmit: P.func.isRequired,
  isSubmitting: P.bool
}

export default ResetPassword
