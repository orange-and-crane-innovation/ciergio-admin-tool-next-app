import Contacts from '@app/components/pages/contact-us/complex'
import { RolesPermissions } from '@app/components/rolespermissions'
import { useRouter } from 'next/router'

function ContactList() {
  const router = useRouter()
  const { id } = router.query

  return (
    <RolesPermissions permissionGroup="contactPage" moduleName="contactPage">
      <Contacts id={id} />
    </RolesPermissions>
  )
}

export default ContactList
