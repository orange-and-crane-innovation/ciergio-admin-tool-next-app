import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import PageLoader from '@app/components/page-loader'
import { ACCOUNT_TYPES } from '@app/constants'

const withGuest = WrappedComponent => {
  // const system = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  // const isSystemPray = system === 'pray'
  // const isSystemCircle = system === 'circle'

  const GuestComponent = props => {
    const router = useRouter()
    const [loaded, setLoaded] = useState(false)
    const isBrowser = typeof window !== 'undefined'
    const profile = isBrowser && JSON.parse(localStorage.getItem('profile'))

    useEffect(() => {
      if (profile) {
        const accountType = profile?.accounts?.data[0]?.accountType

        // if (isSystemPray && accountType !== ACCOUNT_TYPES.SUP.value) {
        //   router.push('/posts')
        // } else if (isSystemCircle && accountType !== ACCOUNT_TYPES.SUP.value) {
        //   router.push('/attractions-events')
        // } else {
        //   router.push('/properties')
        // }

        if (accountType === ACCOUNT_TYPES.SUP.value) {
          router.push('/dashboard')
        } else {
          router.push('/account/profile')
        }
      } else {
        setLoaded(true)
      }
    }, [profile])

    if (!loaded) {
      return <PageLoader fullPage />
    }

    return <WrappedComponent {...props} />
  }

  return GuestComponent
}

export default withGuest
