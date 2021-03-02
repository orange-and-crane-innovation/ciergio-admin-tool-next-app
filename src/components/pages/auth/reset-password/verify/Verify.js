import { useState } from 'react'
import P from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import CiergioMiniLogo from '@app/assets/svg/ciergio-mini.svg'
import style from './Verify.module.css'

const validationSchema = yup.object().shape({
  token: yup
    .string()
    .label('Code')
    .required()
    .test('len', 'Must be 6 characters', val => val.length === 6)
})

function Verify({ onSubmit, isSubmitting }) {
  const [isDisabled, setIsDisabled] = useState(true)

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      token: ''
    }
  })

  const onTokenChange = e => {
    if (e.target.value !== '') {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }

  return (
    <main className={style.Verify}>
      <div className={style.VerifyWrapper}>
        <div className={style.LogoContainer}>
          <CiergioLogo className={style.Logo} />
        </div>

        <div className={style.VerifyCard}>
          <form className={style.VerifyForm} onSubmit={handleSubmit(onSubmit)}>
            <h2>Enter Code</h2>
            <p>Please enter the code sent to your email.</p>

            <Controller
              name="token"
              control={control}
              render={({ name, value, onChange, ...props }) => (
                <FormInput
                  name={name}
                  value={value}
                  maxLength={6}
                  label="6-character code"
                  placeholder="Enter code"
                  error={errors?.token?.message ?? null}
                  onChange={e => {
                    onChange(e)
                    onTokenChange(e)
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

        <div className={style.MiniFooter}>
          <span>Powered by </span>
          <CiergioMiniLogo />
        </div>
      </div>
    </main>
  )
}

Verify.defaultProps = {
  isSubmitting: false
}

Verify.propTypes = {
  onSubmit: P.func.isRequired,
  isSubmitting: P.bool
}

export default Verify
