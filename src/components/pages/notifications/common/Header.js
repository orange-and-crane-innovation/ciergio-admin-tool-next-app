import P from 'prop-types'
import { useRouter } from 'next/router'

import Button from '@app/components/button'

import { FaPlusCircle } from 'react-icons/fa'

const Header = ({ title }) => {
  const router = useRouter()

  const goToCreate = () => router.push('/notifications/create')

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-base px-8 py-4">{title}</h1>
        <Button
          primary
          leftIcon={<FaPlusCircle />}
          label="Create Notifications"
          onClick={goToCreate}
          className="mr-4 mt-4"
        />
      </div>
    </>
  )
}

Header.propTypes = {
  title: P.string.required
}

export default Header
