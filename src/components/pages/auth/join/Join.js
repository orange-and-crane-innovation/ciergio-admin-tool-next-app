import { useState, useEffect } from 'react'
import Link from 'next/link'
import P from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PasswordStrengthBar from 'react-password-strength-bar'

import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import CiergioMiniLogo from '@app/assets/svg/ciergio-mini.svg'
import PageLoader from '@app/components/page-loader'

import { ACCOUNT_TYPES } from '@app/constants'
import getAccountTypeName from '@app/utils/getAccountTypeName'

import style from './Join.module.css'

const validationSchema = yup.object().shape({
  email: yup.string().email().label('Email Address').required(),
  firstName: yup.string().label('First Name').required(),
  lastName: yup.string().label('Last Name').required(),
  password: yup
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

function Join({ onSubmit, isSubmitting, data }) {
  const [isDisabled, setIsDisabled] = useState(true)
  const [property, setProperty] = useState()
  const [accountType, setAccountType] = useState()
  const [password, setPassword] = useState()

  const { handleSubmit, control, errors, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    }
  })

  useEffect(() => {
    if (data) {
      setValue('email', data?.email)
      setAccountType(data?.accountType)
      setProperty(
        data?.accountType === ACCOUNT_TYPES.COMPXAD.value
          ? data?.complex?.name
          : data?.accountType === ACCOUNT_TYPES.BUIGAD.value
          ? data?.building?.name
          : data?.company?.name
      )
    }
  }, [data])

  const onChangeText = e => {
    if (e.target.value !== '') {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }

  return (
    <main className={style.Join}>
      <div className={style.JoinWrapper}>
        <div className={style.LogoContainer}>
          <CiergioLogo className={style.Logo} />
        </div>

        <div className={style.JoinCard}>
          {isSubmitting && <PageLoader />}
          {data && (
            <form className={style.JoinForm} onSubmit={handleSubmit(onSubmit)}>
              <h2>Register</h2>
              <p>
                {`You are registering as a ${getAccountTypeName(
                  accountType
                )} for ${property}.`}
              </p>

              <Controller
                name="email"
                control={control}
                render={({ name, value, onChange, ...props }) => (
                  <FormInput
                    name={name}
                    value={value}
                    label="Email"
                    placeholder="Enter you email"
                    readOnly
                    error={errors?.email?.message ?? null}
                    onChange={onChange}
                    inputProps={props}
                  />
                )}
              />

              <div className={style.JoinName}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ name, value, onChange, ...props }) => (
                    <FormInput
                      name={name}
                      value={value}
                      label="First Name"
                      placeholder="Enter your first name"
                      error={errors?.firstName?.message ?? null}
                      onChange={e => {
                        onChange(e)
                        onChangeText(e)
                      }}
                      inputProps={props}
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  render={({ name, value, onChange, ...props }) => (
                    <FormInput
                      name={name}
                      value={value}
                      label="Last Name"
                      placeholder="Enter your last name"
                      error={errors?.lastName?.message ?? null}
                      onChange={e => {
                        onChange(e)
                        onChangeText(e)
                      }}
                      inputProps={props}
                    />
                  )}
                />
              </div>

              <Controller
                name="password"
                control={control}
                render={({ name, value, onChange, ...props }) => (
                  <>
                    <FormInput
                      type="password"
                      name={name}
                      value={value}
                      maxLength={16}
                      label="Password"
                      placeholder="Create your password"
                      error={errors?.password?.message ?? null}
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
                disabled={isDisabled}
                fluid
                primary
              />
            </form>
          )}
          {!data && !isSubmitting && (
            <p className={style.PageError}>
              The code is invalid, make sure you have entered the valid invite
              code from your email.
            </p>
          )}
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

Join.defaultProps = {
  isSubmitting: false
}

Join.propTypes = {
  onSubmit: P.func.isRequired,
  isSubmitting: P.bool,
  data: P.object
}

export default Join
