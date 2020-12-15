import React from 'react'
import Error from 'next/error'
import {useRouter} from 'next/router'
import Centered from '@app/layouts/centered'
import Layout from '@app/layouts/layout-1'
import Empty from './empty'

const Layouts = ({children}) => {
    const router = useRouter()
    let { pathname } = {...router}
    
    if (['/404', '/500'].includes(pathname)) {
        return <Centered>{children}</Centered>
    }

    if (['/auth/login'].includes(pathname)) {
        return <Centered>{children}</Centered>
    } else {
        return <Layout>{children}</Layout>
    }
}

export default Layouts