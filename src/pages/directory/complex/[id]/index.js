import Contacts from '@app/components/pages/directory/complex'
import { RolesPermissions } from '@app/components/rolespermissions'
import { useRouter } from 'next/router'

function ContactList() {
  const router = useRouter()
  const { id } = router.query

  return (
    <RolesPermissions permission="directory">
      <Contacts id={id} />
    </RolesPermissions>
  )
}

export default ContactList
