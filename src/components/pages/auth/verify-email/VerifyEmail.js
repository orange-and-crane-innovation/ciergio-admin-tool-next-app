import React from 'react'
import P from 'prop-types'
import CiergioLogo from '@app/assets/svg/ciergio-logo.svg'
import CiergioMiniLogo from '@app/assets/svg/ciergio-mini.svg'
import PageLoader from '@app/components/page-loader'

import style from './VerifyEmail.module.css'

function VerifyEmail({ loading, data, error }) {
  console.log(loading)
  const errorLists = {
    1000: {
      errorType: style.PageError,
      message: 'Email verification links has already been expired.'
    },
    4000: {
      errorType: style.PageInfo,
      message: 'Your email has already been verified.'
    },
    default: {
      errorType: style.PageError,
      message:
        'Verification failed. Make sure you have copied a valid verification link from your email.'
    }
  }
  console.log(data)
  return (
    <main className={style.PageContainer}>
      <div className={style.PageWrapper}>
        <div className={style.LogoContainer}>
          {data?.companyLogo ? (
            <img className={style.Logo} src={data?.companyLogo} alt="logo" />
          ) : (
            <CiergioLogo className={style.Logo} />
          )}
        </div>

        <div className={style.PageCard}>
          {loading && <PageLoader message="Verifying your account..." />}
          {data && (
            <p className={style.PageSuccess}>
              Congratulations! You have successfuly verified your email.
            </p>
          )}
          {error && (
            <p
              className={
                errorLists[error?.code]?.errorType ??
                errorLists.default.errorType
              }
            >
              {errorLists[error?.code]?.message ?? errorLists.default.message}
            </p>
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

VerifyEmail.defaultProps = {
  loading: false
}

VerifyEmail.propTypes = {
  loading: P.bool,
  data: P.object,
  error: P.object
}

export default VerifyEmail
