import { useState, useEffect } from 'react'
import Link from 'next/link'
import P from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PasswordStrengthBar from 'react-password-strength-bar'

import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import PageLoader from '@app/components/page-loader'
import Checkbox from '@app/components/forms/form-checkbox'

import { ACCOUNT_TYPES } from '@app/constants'
import getAccountTypeName from '@app/utils/getAccountTypeName'

import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import CiergioMiniLogo from '@app/assets/svg/ciergio-mini.svg'

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

const validationSchemaExistingUser = yup.object().shape({
  email: yup.string().email().label('Email Address').required()
})

function Join({ onSubmit, isLoading, isSubmitting, data }) {
  const [isDisabled, setIsDisabled] = useState(true)
  const [property, setProperty] = useState()
  const [accountType, setAccountType] = useState()
  const [password, setPassword] = useState()
  const [isCheck, setIsCheck] = useState()

  const { handleSubmit, control, errors, setValue } = useForm({
    resolver: yupResolver(
      data?.existingUser ? validationSchemaExistingUser : validationSchema
    ),
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
      if (isCheck) {
        setIsDisabled(false)
      }
    } else {
      setIsDisabled(true)
    }
  }

  const onCheck = e => {
    setIsCheck(e.target.checked)
  }

  return (
    <main className={style.Join}>
      <div className={style.JoinWrapper}>
        <div className={style.LogoContainer}>
          <CiergioLogo className={style.Logo} />
        </div>

        <div className={style.JoinCard}>
          {isLoading && <PageLoader />}
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

              {!data?.existingUser && (
                <>
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
                </>
              )}

              <br />

              <div className="flex items-center mb-6">
                <Checkbox
                  primary
                  id="terms"
                  name="terms"
                  label={
                    <span className="font-body leading-7">
                      <span>I have read and accepted the </span>
                      <Link href="/terms-and-conditions">
                        <a
                          className="text-info-900 hover:underline"
                          target="_blank"
                        >
                          Terms and Conditions
                        </a>
                      </Link>
                    </span>
                  }
                  onChange={e => onCheck(e)}
                />
              </div>

              <Button
                label="Submit"
                type="submit"
                loading={isSubmitting}
                disabled={isDisabled && !isCheck}
                fluid
                primary
              />
            </form>
          )}
          {!data && !isLoading && (
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
  isLoading: false,
  isSubmitting: false
}

Join.propTypes = {
  onSubmit: P.func.isRequired,
  isLoading: P.bool,
  isSubmitting: P.bool,
  data: P.object
}

export default Join
